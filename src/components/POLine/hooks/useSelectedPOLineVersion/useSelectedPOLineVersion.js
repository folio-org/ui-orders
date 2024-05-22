import {
  useContext,
  useMemo,
} from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import {
  filter,
  flow,
  get,
  keyBy,
  uniq,
} from 'lodash/fp';

import {
  checkIfUserInCentralTenant,
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  ConsortiumLocationsContext,
  LocationsContext,
  useCentralOrderingSettings,
} from '@folio/stripes-acq-components';

import {
  getMaterialTypes,
  getOrganizationsByIds,
  getVersionMetadata,
} from '../../../../common/utils';
import {
  useAcqMethods,
  useOrder,
  useOrderLine,
} from '../../../../common/hooks';

export const useSelectedPOLineVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'order-line-version-data' });

  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
  const getReferenceFieldValue = (condition, value) => condition && (value || deletedRecordLabel);

  const currentVersion = useMemo(() => (
    versions?.find(({ id }) => id === versionId)
  ), [versionId, versions]);
  const versionSnapshot = useMemo(() => (
    get(snapshotPath, currentVersion)
  ), [snapshotPath, currentVersion]);

  const linkedPackagePoLineId = versionSnapshot?.packagePoLineId;

  const {
    enabled: isCentralOrderingEnabled,
    isLoading: isCentralOrderingSettingsLoading,
  } = useCentralOrderingSettings({
    enabled: checkIfUserInCentralTenant(stripes),
  });
  const {
    order,
    isLoading: isOrderLoading,
  } = useOrder(currentVersion?.orderId);
  const {
    orderLine,
    isLoading: isOrderLineLoading,
  } = useOrderLine(currentVersion?.orderLineId);
  const {
    orderLine: linkedOrderLine,
    isLoading: isLinkedOrderLineLoading,
  } = useOrderLine(linkedPackagePoLineId);
  const {
    acqMethods,
    isLoading: isAcqMethodsLoading,
  } = useAcqMethods();
  const {
    isLoading: isLocationsLoading,
    locations,
  } = useContext(isCentralOrderingEnabled ? ConsortiumLocationsContext : LocationsContext);

  const {
    isLoading: isVersionDataLoading,
    data: selectedVersion = {},
  } = useQuery(
    [namespace, versionId, versionSnapshot?.id],
    async () => {
      const accessProviderId = versionSnapshot?.accessProvider;
      const eresource = versionSnapshot?.eresource || {};
      const physical = versionSnapshot?.physical || {};
      const vendorId = versionSnapshot?.vendorId;
      const vendorDetail = versionSnapshot?.vendorDetail || {};
      const accountNumber = versionSnapshot?.vendorDetail?.vendorAccount;

      const eresourceMaterialType = eresource?.materialType;
      const eresourceAccessProvider = eresource?.accessProvider;
      const physicalMaterialType = physical?.materialType;
      const materialSupplierId = physical?.materialSupplier;

      const organizationIds = flow(
        uniq,
        filter(Boolean),
      )([
        accessProviderId,
        eresourceAccessProvider,
        materialSupplierId,
        vendorId,
      ]);

      const [
        organizationsMap,
        materialTypesMap,
      ] = await Promise.all([
        getOrganizationsByIds(ky)(organizationIds).then(keyBy('id')),
        getMaterialTypes(ky)()
          .then(({ mtypes }) => mtypes)
          .then(keyBy('id')),
      ]);

      const vendor = organizationsMap[order?.vendor];
      const vendorAccount = vendor?.accounts?.find(({ accountNo }) => accountNo === accountNumber);

      return {
        ...versionSnapshot,
        order,
        locationsList: locations,
        acquisitionMethod: (
          acqMethods.find(({ id }) => id === versionSnapshot?.acquisitionMethod)?.value || deletedRecordLabel
        ),
        packagePoLineId: getReferenceFieldValue(linkedPackagePoLineId, linkedOrderLine?.titleOrPackage),
        accessProvider: getReferenceFieldValue(accessProviderId, organizationsMap[accessProviderId]?.name),
        eresource: eresource && {
          ...eresource,
          accessProvider: getReferenceFieldValue(
            eresourceAccessProvider,
            organizationsMap[eresourceAccessProvider]?.name,
          ),
          materialType: getReferenceFieldValue(eresourceMaterialType, materialTypesMap[eresourceMaterialType]?.name),
        },
        physical: physical && {
          ...physical,
          materialSupplier: getReferenceFieldValue(materialSupplierId, organizationsMap[materialSupplierId]?.name),
          materialType: getReferenceFieldValue(physicalMaterialType, materialTypesMap[physicalMaterialType]?.name),
          volumes: physical?.volumes?.join(', '),
        },
        vendorDetail: {
          ...vendorDetail,
          vendorAccount: accountNumber && (
            vendorAccount ? `${vendorAccount.name} (${vendorAccount.accountNo})` : accountNumber
          ),
        },
        metadata: getVersionMetadata(currentVersion, orderLine),
      };
    },
    {
      enabled: Boolean(
        versionId
        && !isOrderLoading
        && !isOrderLineLoading
        && !isLinkedOrderLineLoading
        && !isAcqMethodsLoading
        && !isCentralOrderingSettingsLoading
        && !isLocationsLoading,
      ),
      ...options,
    },
  );

  const isLoading = (
    isOrderLoading
    || isOrderLineLoading
    || isLinkedOrderLineLoading
    || isAcqMethodsLoading
    || isVersionDataLoading
    || isCentralOrderingSettingsLoading
    || isLocationsLoading
  );

  return {
    selectedVersion,
    isLoading,
  };
};
