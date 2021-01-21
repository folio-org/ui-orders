import {
  flatten,
  uniq,
} from 'lodash';

import {
  CONFIG_ADDRESSES,
  MODULE_TENANT,
} from '../../../components/Utils/const';
import { fetchExportDataByIds } from '../../utils';
import { getAddresses } from '../../utils/getAddresses';
import { createExportReport } from './createExportReport';

export const getExportData = async (mutator, lines, orders, intl) => {
  const orderVendorIds = uniq(orders.map(({ vendor }) => vendor));
  const lineVendorIds = uniq(flatten((lines.map(({ physical, eresource }) => ([
    physical?.materialSupplier, eresource?.accessProvider,
  ]))))).filter(Boolean);
  const vendorIds = uniq(flatten([...orderVendorIds, ...lineVendorIds]));
  const vendors = await fetchExportDataByIds(mutator.exportVendors, vendorIds);
  const userIds = uniq(flatten((orders.map(({ metadata, assignedTo, approvedBy }) => ([
    metadata?.createdByUserId, metadata?.updatedByUserId, assignedTo, approvedBy,
  ]))))).filter(Boolean);
  const users = await fetchExportDataByIds(mutator.exportUsers, userIds);
  const acqUnitsIds = uniq(flatten((orders.map(({ acqUnitIds }) => acqUnitIds))));
  const acqUnits = await fetchExportDataByIds(mutator.exportAcqUnits, acqUnitsIds);
  const mTypeIds = uniq(flatten(lines.map(({ physical, eresource }) => ([
    physical?.materialType, eresource?.materialType,
  ])))).filter(Boolean);
  const mTypes = await fetchExportDataByIds(mutator.exportMaterialTypes, mTypeIds);
  const locationIds = uniq(flatten(lines.map(({ locations }) => (
    locations?.map(({ locationId }) => locationId
  ))))).filter(Boolean);
  const lineLocations = await fetchExportDataByIds(mutator.exportLocations, locationIds);
  const contributorNameTypeIds = uniq(flatten(lines.map(({ contributors }) => (
    contributors?.map(({ contributorNameTypeId }) => contributorNameTypeId
  ))))).filter(Boolean);
  const contributorNameTypes = await fetchExportDataByIds(mutator.exportContributorNameTypes, contributorNameTypeIds);
  const identifierTypeIds = uniq(flatten(lines.map(({ details }) => (
    details?.productIds?.map(({ productIdType }) => productIdType
  ))))).filter(Boolean);
  const identifierTypes = await fetchExportDataByIds(mutator.exportIdentifierTypes, identifierTypeIds);
  const expenseClassIds = uniq(flatten(lines.map(({ fundDistribution }) => (
    fundDistribution?.map(({ expenseClassId }) => expenseClassId
  ))))).filter(Boolean);
  const expenseClasses = await fetchExportDataByIds(mutator.exportExpenseClasses, expenseClassIds);
  const addressIds = uniq(flatten(orders.map(({ billTo, shipTo }) => ([billTo, shipTo])))).filter(Boolean);
  const buildAddressQuery = (itemsChunk) => {
    const subQuery = itemsChunk
      .map(id => `id==${id}`)
      .join(' or ');
    const query = subQuery ? `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES} and (${subQuery}))` : '';

    return query;
  };
  const addressRecords = await fetchExportDataByIds(mutator.exportAddresses, addressIds, buildAddressQuery);
  const addresses = getAddresses(addressRecords);

  return (createExportReport(
    intl,
    lines,
    orders,
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
