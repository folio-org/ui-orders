import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

import {
  CONFIG_ADDRESSES,
  MODULE_TENANT,
} from '../../../components/Utils/const';
import { fetchExportDataByIds } from '../../utils';
import { getAddresses } from '../../utils/getAddresses';
import { createExportReport } from './createExportReport';

const getExportUserIds = (lines = [], orders = []) => {
  const lineUserIds = lines.map(({ metadata }) => {
    return [metadata?.createdByUserId, metadata?.updatedByUserId];
  });
  const orderUserIds = orders.map(({ metadata, assignedTo, approvedById }) => ([
    metadata?.createdByUserId, metadata?.updatedByUserId, assignedTo, approvedById,
  ]));

  return uniq(flatten([...lineUserIds, ...orderUserIds])).filter(Boolean);
};

const buildAddressQuery = (itemsChunk) => {
  const subQuery = itemsChunk
    .map(id => `id==${id}`)
    .join(' or ');
  const query = subQuery ? `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES} and (${subQuery}))` : '';

  return query;
};

const extractUniqueFlat = (array, extractor) => uniq(array.flatMap(item => extractor(item) || []).filter(Boolean));

export const getExportData = async (mutator, lines, orders, customFields, intl) => {
  /* Orders based */
  const acqUnitsIds = extractUniqueFlat(orders, ({ acqUnitIds }) => acqUnitIds);
  const addressIds = extractUniqueFlat(orders, ({ billTo, shipTo }) => [billTo, shipTo]);
  const fiscalYearIds = extractUniqueFlat(orders, ({ fiscalYearId }) => fiscalYearId);
  const orderVendorIds = extractUniqueFlat(orders, (({ vendor }) => vendor));

  /* Lines based */
  const acquisitionMethodsIds = extractUniqueFlat(lines, ({ acquisitionMethod }) => acquisitionMethod);
  const lineHoldingIds = extractUniqueFlat(lines, ({ locations }) => locations?.map(({ holdingId }) => holdingId));
  const lineLocationIds = extractUniqueFlat(lines, ({ locations }) => locations?.map(({ locationId }) => locationId));
  const contributorNameTypeIds = extractUniqueFlat(
    lines,
    ({ contributors }) => contributors?.map(({ contributorNameTypeId }) => contributorNameTypeId),
  );
  const expenseClassIds = extractUniqueFlat(
    lines,
    ({ fundDistribution }) => fundDistribution?.map(({ expenseClassId }) => expenseClassId),
  );
  const identifierTypeIds = extractUniqueFlat(
    lines,
    ({ details }) => details?.productIds?.map(({ productIdType }) => productIdType),
  );
  const lineVendorIds = extractUniqueFlat(
    lines,
    ({ physical, eresource }) => [physical?.materialSupplier, eresource?.accessProvider],
  );
  const mTypeIds = extractUniqueFlat(
    lines,
    ({ physical, eresource }) => [physical?.materialType, eresource?.materialType],
  );

  const vendors = await fetchExportDataByIds(mutator.exportVendors, uniq([...orderVendorIds, ...lineVendorIds]));
  const lineHoldings = await fetchExportDataByIds(mutator.exportHoldings, lineHoldingIds);

  const organizationTypeIds = extractUniqueFlat(vendors, ({ organizationTypes }) => organizationTypes);

  const locationIds = uniq([
    ...lineLocationIds,
    ...lineHoldings.map(({ permanentLocationId }) => permanentLocationId),
  ]);

  // TODO: remove logs
  console.log('vendorIds', uniq([...orderVendorIds, ...lineVendorIds]));
  console.log('locationIds', locationIds);

  const [
    lineLocations,
    orgTypes,
    users,
    acqUnits,
    mTypes,
    contributorNameTypes,
    identifierTypes,
    expenseClasses,
    addresses,
    acquisitionMethods,
    fiscalYears,
  ] = await Promise.all([
    fetchExportDataByIds(mutator.exportLocations, locationIds),
    fetchExportDataByIds(mutator.organizationTypes, organizationTypeIds),
    fetchExportDataByIds(mutator.exportUsers, getExportUserIds(lines, orders)),
    fetchExportDataByIds(mutator.exportAcqUnits, acqUnitsIds),
    fetchExportDataByIds(mutator.exportMaterialTypes, mTypeIds),
    fetchExportDataByIds(mutator.exportContributorNameTypes, contributorNameTypeIds),
    fetchExportDataByIds(mutator.exportIdentifierTypes, identifierTypeIds),
    fetchExportDataByIds(mutator.exportExpenseClasses, expenseClassIds),
    fetchExportDataByIds(mutator.exportAddresses, addressIds, buildAddressQuery).then(getAddresses),
    fetchExportDataByIds(mutator.acquisitionMethods, acquisitionMethodsIds),
    fetchExportDataByIds(mutator.fiscalYears, fiscalYearIds),
  ]);

  return createExportReport(
    intl,
    lines,
    orders,
    customFields,
    vendors,
    users,
    acqUnits,
    mTypes,
    lineLocations,
    lineHoldings,
    contributorNameTypes,
    identifierTypes,
    expenseClasses,
    addresses,
    acquisitionMethods,
    orgTypes,
    fiscalYears,
  );
};
