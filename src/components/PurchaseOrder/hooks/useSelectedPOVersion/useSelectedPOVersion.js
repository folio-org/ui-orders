import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import {
  filter,
  flow,
  get,
  keyBy,
  uniq,
} from 'lodash/fp';

import { getFullName } from '@folio/stripes/util';
import { getAddresses, useUsersBatch } from '@folio/stripes-acq-components';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  getAcqUnitsByIds,
  getOrganizationsByIds,
  getTenantAddresses,
} from '../../../../common/utils';

const getUniqItems = (arr) => (
  flow(
    uniq,
    filter(Boolean),
  )(arr)
);

export const useSelectedPOVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-version-data' });

  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
  const versionSnapshot = useMemo(() => (
    get(snapshotPath, versions?.find(({ id }) => id === versionId))
  ), [snapshotPath, versionId, versions]);

  const assignedToId = versionSnapshot?.assignedTo;
  const createdByUserId = versionSnapshot?.metadata?.createdByUserId;
  const vendorId = versionSnapshot?.vendor;
  const billToId = versionSnapshot?.billTo;
  const shipToId = versionSnapshot?.shipTo;

  const versionUserIds = getUniqItems([assignedToId, createdByUserId]);
  const { users, isLoading: isUsersLoading } = useUsersBatch(versionUserIds);
  const versionUsersMap = keyBy('id', users);

  const { isLoading, data: selectedVersion = {} } = useQuery(
    [namespace, versionId, versionSnapshot?.id],
    async () => {
      const organizationIds = [vendorId];
      const acqUnitsIds = versionSnapshot?.acqUnitIds || [];

      const [
        organizationsMap,
        acqUnitsMap,
        addressesMap,
      ] = await Promise.all([
        getOrganizationsByIds(ky)(organizationIds).then(keyBy('id')),
        getAcqUnitsByIds(ky)(acqUnitsIds).then(keyBy('id')),
        getTenantAddresses(ky)()
          .then(({ configs }) => getAddresses(configs))
          .then(keyBy('id')),
      ]);

      const assignedTo = versionUsersMap[assignedToId]
        ? getFullName(versionUsersMap[assignedToId])
        : deletedRecordLabel;

      const createdByUser = versionUsersMap[createdByUserId]
        ? getFullName(versionUsersMap[assignedToId])
        : deletedRecordLabel;

      return {
        ...versionSnapshot,
        acqUnits: acqUnitsIds.map(acqUnitsId => acqUnitsMap[acqUnitsId]?.name || deletedRecordLabel).join(', '),
        assignedTo: assignedToId && assignedTo,
        vendor: organizationsMap[vendorId]?.name || deletedRecordLabel,
        createdByUser: createdByUserId && createdByUser,
        billTo: billToId && (addressesMap[billToId]?.address || deletedRecordLabel),
        shipTo: shipToId && (addressesMap[shipToId]?.address || deletedRecordLabel),
      };
    },
    {
      enabled: Boolean(versionId && !isUsersLoading),
      ...options,
    },
  );

  return {
    selectedVersion,
    isLoading,
  };
};
