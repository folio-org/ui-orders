import { useMemo } from 'react';
import { useIntl } from 'react-intl';
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
  fetchFiscalYearByIds,
  getAddresses,
  useUsersBatch,
  useVersionHistoryValueResolvers,
} from '@folio/stripes-acq-components';

import { useOrder } from '../../../../common/hooks';
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

const formatFiscalYear = (fiscalYearId, fiscalYearDict, intl) => {
  if (!fiscalYearId) return undefined;

  const fiscalYear = fiscalYearDict[fiscalYearId];

  return fiscalYear
    ? `${fiscalYear.name} (${fiscalYear.code})`
    : intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
};

export const useSelectedPOVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const ky = useOkapiKy();
  const intl = useIntl();
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
    getUserFullNameById,
  } = useVersionHistoryValueResolvers();

  const metadata = useMemo(() => getVersionMetadata(currentVersion, order), [currentVersion, order]);
  const assignedToId = versionSnapshot?.assignedTo;
  const createdByUserId = metadata?.createdByUserId;
  const fiscalYearId = versionSnapshot?.fiscalYearId;
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
    async ({ signal }) => {
      const kyExtended = ky.extend({ signal });

      const organizationIds = [vendorId];
      const acqUnitsIds = versionSnapshot?.acqUnitIds || [];
      const fiscalYearIds = [fiscalYearId].filter(Boolean);

      const [
        organizationsDict,
        acqUnitsDict,
        addressesDict,
        fiscalYearDict,
      ] = await Promise.all([
        getOrganizationsByIds(kyExtended)(organizationIds).then(keyBy('id')),
        getAcqUnitsByIds(kyExtended)(acqUnitsIds).then(keyBy('id')),
        getTenantAddresses(kyExtended)()
          .then(({ configs }) => getAddresses(configs))
          .then(keyBy('id')),
        fetchFiscalYearByIds(kyExtended)(fiscalYearIds).then(({ fiscalYears }) => keyBy('id', fiscalYears)),
      ]);

      return {
        ...versionSnapshot,
        acqUnits: acqUnitsIds.map((id) => getObjectPropertyById(id, 'name', acqUnitsDict)).join(', '),
        assignedTo: getUserFullNameById(assignedToId, versionUsersMap),
        createdByUser: getUserFullNameById(createdByUserId, versionUsersMap),
        fiscalYear: formatFiscalYear(fiscalYearId, fiscalYearDict, intl),
        vendor: getObjectPropertyById(vendorId, 'name', organizationsDict),
        billTo: getObjectPropertyById(billToId, 'address', addressesDict),
        shipTo: getObjectPropertyById(shipToId, 'address', addressesDict),
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
