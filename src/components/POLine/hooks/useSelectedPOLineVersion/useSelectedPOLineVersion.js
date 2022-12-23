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

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  getLocations,
  getMaterialTypes,
  getOrganizationsByIds,
} from '../../../../common/utils';
import {
  useAcqMethods,
  useOrder,
  useOrderLine,
} from '../../../../common/hooks';

export const useSelectedPOLineVersion = ({ versionId, versions, snapshotPath }, options = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-line-version-data' });

  const deletedRecordLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });
  const versionSnapshot = useMemo(() => (
    get(snapshotPath, versions?.find(({ id }) => id === versionId))
  ), [snapshotPath, versionId, versions]);

  const linkedPackagePoLineId = versionSnapshot?.packagePoLineId;

  const { order, isLoading: isOrderLoading } = useOrder(versionSnapshot?.purchaseOrderId);
  const { orderLine, isLoading: isOrderLineLoading } = useOrderLine(linkedPackagePoLineId);
  const { acqMethods, isLoading: isAcqMethodsLoading } = useAcqMethods();

  const { isLoading, data: selectedVersion = {} } = useQuery(
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
        locationsList,
      ] = await Promise.all([
        getOrganizationsByIds(ky)(organizationIds).then(keyBy('id')),
        getMaterialTypes(ky)()
          .then(({ mtypes }) => mtypes)
          .then(keyBy('id')),
        getLocations(ky)().then(({ locations }) => locations),
      ]);

      const vendor = organizationsMap[order?.vendor];
      const vendorAccount = vendor?.accounts?.find(({ accountNo }) => accountNo === accountNumber);

      return {
        ...versionSnapshot,
        order,
        locationsList,
        acquisitionMethod: (
          acqMethods.find(({ id }) => id === versionSnapshot?.acquisitionMethod)?.value || deletedRecordLabel
        ),
        packagePoLineId: linkedPackagePoLineId && (
          orderLine?.titleOrPackage || deletedRecordLabel
        ),
        accessProvider: accessProviderId && (
          organizationsMap[accessProviderId]?.name || deletedRecordLabel
        ),
        eresource: eresource && {
          ...eresource,
          accessProvider: eresourceAccessProvider && (
            organizationsMap[eresourceAccessProvider]?.name || deletedRecordLabel
          ),
          materialType: eresourceMaterialType && (
            materialTypesMap[eresourceMaterialType]?.name || deletedRecordLabel
          ),
        },
        physical: physical && {
          ...physical,
          materialSupplier: materialSupplierId && (
            organizationsMap[materialSupplierId]?.name || deletedRecordLabel
          ),
          materialType: physicalMaterialType && (
            materialTypesMap[physicalMaterialType]?.name || deletedRecordLabel
          ),
        },
        vendorDetail: {
          ...vendorDetail,
          vendorAccount: accountNumber && (
            vendorAccount ? `${vendorAccount.name} (${vendorAccount.accountNo})` : accountNumber
          ),
        },
      };
    },
    {
      enabled: Boolean(
        versionId
        && !isOrderLoading
        && !isOrderLineLoading
        && !isAcqMethodsLoading,
      ),
      ...options,
    },
  );

  return {
    selectedVersion,
    isLoading,
  };
};
