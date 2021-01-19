import {
  flatten,
  uniq,
} from 'lodash';

import {
  CONFIG_ADDRESSES,
  MODULE_TENANT,
} from '../../components/Utils/const';
import { createExportReport } from './createExportReport';
import { getAddresses } from './getAddresses';
import { fetchExportDataByIds } from './fetchExportDataByIds';

export const getExportData = async (
  vendorMutator,
  userMutator,
  acqUnitMutator,
  mTypeMutator,
  locationMutator,
  contributorNameTypeMutator,
  identifierTypeMutator,
  expenseClassMutator,
  addressMutator,
  orderLineRecords = [],
  orderRecords = [],
) => {
  const orderVendorIds = uniq(orderRecords.map(({ vendor }) => vendor));
  const lineVendorIds = uniq(flatten((orderLineRecords.map(({ physical, eresource }) => ([
    physical?.materialSupplier, eresource?.accessProvider,
  ]))))).filter(Boolean);
  const vendorIds = uniq(flatten([...orderVendorIds, ...lineVendorIds]));
  const vendors = await fetchExportDataByIds(vendorMutator, vendorIds);
  const userIds = uniq(flatten((orderRecords.map(({ metadata, assignedTo, approvedBy }) => ([
    metadata?.createdByUserId, metadata?.updatedByUserId, assignedTo, approvedBy,
  ]))))).filter(Boolean);
  const users = await fetchExportDataByIds(userMutator, userIds);
  const acqUnitsIds = uniq(flatten((orderRecords.map(({ acqUnitIds }) => acqUnitIds))));
  const acqUnits = await fetchExportDataByIds(acqUnitMutator, acqUnitsIds);
  const mTypeIds = uniq(flatten(orderLineRecords.map(({ physical, eresource }) => ([
    physical?.materialType, eresource?.materialType,
  ])))).filter(Boolean);
  const mTypes = await fetchExportDataByIds(mTypeMutator, mTypeIds);
  const locationIds = uniq(flatten(orderLineRecords.map(({ locations }) => (
    locations?.map(({ locationId }) => locationId
  ))))).filter(Boolean);
  const lineLocations = await fetchExportDataByIds(locationMutator, locationIds);
  const contributorNameTypeIds = uniq(flatten(orderLineRecords.map(({ contributors }) => (
    contributors?.map(({ contributorNameTypeId }) => contributorNameTypeId
  ))))).filter(Boolean);
  const contributorNameTypes = await fetchExportDataByIds(contributorNameTypeMutator, contributorNameTypeIds);
  const identifierTypeIds = uniq(flatten(orderLineRecords.map(({ details }) => (
    details?.productIds?.map(({ productIdType }) => productIdType
  ))))).filter(Boolean);
  const identifierTypes = await fetchExportDataByIds(identifierTypeMutator, identifierTypeIds);
  const expenseClassIds = uniq(flatten(orderLineRecords.map(({ fundDistribution }) => (
    fundDistribution?.map(({ expenseClassId }) => expenseClassId
  ))))).filter(Boolean);
  const expenseClasses = await fetchExportDataByIds(expenseClassMutator, expenseClassIds);
  const addressIds = uniq(flatten(orderRecords.map(({ billTo, shipTo }) => ([billTo, shipTo])))).filter(Boolean);
  const buildAddressQuery = (itemsChunk) => {
    const subQuery = itemsChunk
      .map(id => `id==${id}`)
      .join(' or ');
    const query = subQuery ? `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES} and (${subQuery}))` : '';

    return query;
  };
  const addressRecords = await fetchExportDataByIds(addressMutator, addressIds, buildAddressQuery);
  const addresses = getAddresses(addressRecords);

  return (createExportReport(
    orderLineRecords,
    orderRecords,
    vendors,
    users,
    acqUnits,
    mTypes,
    lineLocations,
    contributorNameTypes,
    identifierTypes,
    expenseClasses,
    addresses,
  ));
};
