import { useMemo } from 'react';
import { useQuery } from 'react-query';
import {
  filter,
  flow,
  get,
  keyBy,
  uniq,
} from 'lodash/fp';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  getAddresses,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { useOrder, useSelectedPOVersionMethods } from '../../../../common/hooks';
import {
  getAcqUnitsByIds,
  getOrganizationsByIds,
  getTenantAddresses,
  getVersionMetadata,
} from '../../../../common/utils';

const getUniqItems = (arr) => (
  flow(
    uniq,
    filter(Boolean),
  )(arr)
);

export const useSelectedPOVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-version-data' });
  const currentVersion = useMemo(() => (
    versions?.find(({ id }) => id === versionId)
  ), [versionId, versions]);
  const versionSnapshot = useMemo(() => (
    get(snapshotPath, currentVersion)
  ), [snapshotPath, currentVersion]);

  const {
    order,
    isLoading: isOrderLoading,
  } = useOrder(currentVersion?.orderId);

  const {
    getObjectPropertyById,
    getUserFullnameById,
  } = useSelectedPOVersionMethods();

  const metadata = useMemo(() => getVersionMetadata(currentVersion, order), [currentVersion, order]);
  const assignedToId = versionSnapshot?.assignedTo;
  const createdByUserId = metadata?.createdByUserId;
  const vendorId = versionSnapshot?.vendor;
  const billToId = versionSnapshot?.billTo;
  const shipToId = versionSnapshot?.shipTo;

  const versionUserIds = useMemo(() => getUniqItems([assignedToId, createdByUserId]), [assignedToId, createdByUserId]);
  const {
    users,
    isLoading: isUsersLoading,
  } = useUsersBatch(versionUserIds);
  const versionUsersMap = keyBy('id', users);

  const {
    isLoading: isVersionDataLoading,
    data: selectedVersion = {},
  } = useQuery(
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

      return {
        ...versionSnapshot,
        acqUnits: acqUnitsIds.map((id) => getObjectPropertyById(id, 'name', acqUnitsMap)).join(', '),
        assignedTo: getUserFullnameById(assignedToId, versionUsersMap),
        createdByUser: getUserFullnameById(createdByUserId, versionUsersMap),
        vendor: getObjectPropertyById(vendorId, 'name', organizationsMap),
        billTo: getObjectPropertyById(billToId, 'address', addressesMap),
        shipTo: getObjectPropertyById(shipToId, 'address', addressesMap),
        metadata,
      };
    },
    {
      enabled: Boolean(
        versionId
        && order?.id
        && !isOrderLoading
        && !isUsersLoading,
      ),
      ...options,
    },
  );

  const isLoading = (
    isOrderLoading
    || isUsersLoading
    || isVersionDataLoading
  );

  return {
    selectedVersion,
    isLoading,
  };
};
