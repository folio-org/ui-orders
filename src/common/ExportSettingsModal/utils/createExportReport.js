import {
  flatten,
  groupBy,
  merge,
} from 'lodash';

import { getFullName } from '@folio/stripes/util';
import {
  calculateFundAmount,
  formatDate,
  formatDateTime,
  FUND_DISTR_TYPE,
} from '@folio/stripes-acq-components';

import { getRecordMap } from '../../utils';

const getContributorData = (line, contributorNameTypeMap, invalidReferenceLabel) => (
  line.contributors?.map(({ contributor, contributorNameTypeId }) => (
    `"${contributor}""${contributorNameTypeMap[contributorNameTypeId]?.name ?? invalidReferenceLabel}"`
  )).join(' | ')
);

const getProductIdData = (line, identifierTypeMap, invalidReferenceLabel) => (
  line.details?.productIds?.map(i => {
    const productTypeName = identifierTypeMap[i?.productIdType]?.name ?? invalidReferenceLabel;

    return (
      `"${i?.productId}""${i?.qualifier || ''}""${productTypeName}"`
    );
  }).join(' | ')
);

const getFundDistributionData = (line, expenseClassMap, invalidReferenceLabel) => (
  line.fundDistribution?.map(fund => {
    const expenseClassName = fund?.expenseClassId
      ? expenseClassMap[fund?.expenseClassId]?.name ?? invalidReferenceLabel
      : '';

    return (
      `"${fund.code || ''}""${expenseClassName}"
      "${fund.value || '0'}${fund.distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}"
      "${calculateFundAmount(fund, line.cost?.poLineEstimatedPrice || 0, line.cost?.currency || 0)}"`
    );
  }).join(' | ').replace(/\n\s+/g, '')
);

const getLocationData = (line, locationMap, holdingMap, invalidReferenceLabel) => (
  line.locations?.map(l => {
    const location = l.holdingId
      ? locationMap[holdingMap[l.holdingId]?.permanentLocationId]
      : locationMap[l.locationId];

    const locationCode = location?.code ?? invalidReferenceLabel;

    return (
      `"${locationCode}""${l?.quantityPhysical || 0}""${l?.quantityElectronic || 0}"`
    );
  }).join(' | ')
);

const getAddressData = (addressId, addressMap, invalidReferenceLabel) => (
  addressMap[addressId]
    ? `"${addressMap[addressId].name}""${addressMap[addressId].address}"`
    : invalidReferenceLabel
);

const getReferenceNumbers = (line) => (
  line.vendorDetail?.referenceNumbers?.map(({ refNumber, refNumberType }) => (
    `"${refNumber}""${refNumberType}"`
  )).join(' | ')
);

const getOrganizationTypeData = (orgTypeIds, orgTypeMap) => (
  orgTypeIds
    ?.map(orgTypeId => (orgTypeMap[orgTypeId]?.name ? `"${orgTypeMap[orgTypeId]?.name}"` : null))
    ?.filter(Boolean)
    ?.join(' | ')
);

/**
 * Creates a mapping of custom field select options to their corresponding label.
 *
 * @param {Array} customFields - The array of custom fields definitions.
 * @returns {Object} - The mapping of custom fields select options to their label.
 * @example
 * {
 *   "multiselect": {
 *     "opt_0": "A",
 *     "opt_1": "B"
 *   },
 *   "singleselect": {
 *     "opt_0": "1",
 *     "opt_1": "2"
 *   },
 * }
 */
const createCustomFieldsOptionsMapping = (customFields = []) => {
  return customFields.reduce((acc, cf) => {
    const opts = cf.selectField?.options?.values?.reduce((a, v) => {
      a[v.id] = v.value;

      return a;
    }, {});

    acc[cf.refId] = opts;

    return acc;
  }, {});
};

/**
 * Resolves custom fields select options to their corresponding label.
 * In case there are multiple select options present the corresponding labels are sorted and joined by '|'.
 * If there is no mapping available it keeps the value as is.
 *
 * @param {Object} values - Custom fields with unresolved select options.
 * @param {Array} customFields - The array of custom fields definitions.
 * @returns {Object} - Custom fields with their select options resolved to labels.
 * @example
 * // unresolved:
 * {
 *   "multiselect": ["opt_1", "opt_0"],
 *   "singleselect": "opt_0",
 *   "textarea": "abc123",
 * };
 * // resolved:
 * {
 *   "multiselect": "A|B",
 *   "singleselect": "1",
 *   "textarea": "abc123",
 * }
 */
const resolveCustomFields = (values = {}, customFields = []) => {
  const mapping = createCustomFieldsOptionsMapping(customFields);

  return Object.keys(values).reduce((acc, key) => {
    if (mapping[key]) {
      const valueArray = Array.isArray(values[key]) ? values[key] : [values[key]];

      acc[key] = valueArray
        .map((c) => mapping[key][c] || c)
        .sort()
        .join('|');
    } else {
      acc[key] = values[key];
    }

    return acc;
  }, {});
};

const getOrderExportData = ({
  acqUnitMap,
  addressMap,
  customFields,
  intl,
  order,
  organizationTypeMap,
  userMap,
  vendorMap,
}) => {
  const billTo = order?.billTo;
  const shipTo = order?.shipTo;
  const invalidReference = intl.formatMessage({ id: 'ui-orders.export.invalidReference' });

  return {
    poNumber: order.poNumber,
    poNumberPrefix: order.poNumberPrefix,
    poNumberSuffix: order.poNumberSuffix,
    vendor: vendorMap[order.vendor]?.code ?? invalidReference,
    vendorRecord: vendorMap[order.vendor],
    organizationType: getOrganizationTypeData(vendorMap[order.vendor]?.organizationTypes, organizationTypeMap),
    orderType: order.orderType,
    acquisitionsUnits: order.acqUnitIds.map(id => acqUnitMap[id]?.name).join(' | '),
    approvalDate: formatDateTime(order.approvalDate, intl),
    assignedTo: order.assignedTo && (userMap[order.assignedTo]?.username ?? invalidReference),
    billTo: billTo && getAddressData(billTo, addressMap, invalidReference),
    billToRecord: addressMap[billTo],
    shipTo: shipTo && getAddressData(shipTo, addressMap, invalidReference),
    shipToRecord: addressMap[shipTo],
    manualPo: !!order.manualPo,
    reEncumber: order.reEncumber,
    note: order.notes?.join('|'),
    workflowStatus: order.workflowStatus,
    approved: order.approved,
    approvedBy: getFullName(userMap[order.approvedById]),
    interval: order.ongoing?.interval,
    isSubscription: order.ongoing?.isSubscription,
    manualRenewal: order.ongoing?.manualRenewal,
    ongoingNotes: order.ongoing?.notes,
    reviewPeriod: order.ongoing?.reviewPeriod,
    renewalDate: formatDate(order.ongoing?.renewalDate, intl),
    reviewDate: formatDate(order.ongoing?.reviewDate, intl),
    poTags: order.tags?.tagList?.join('|'),
    customFields: resolveCustomFields(order.customFields, customFields),
    dateOrdered: formatDateTime(order?.dateOrdered, intl),
    createdBy: userMap[order.metadata?.createdByUserId]?.username ?? invalidReference,
    dateCreated: formatDateTime(order.metadata?.createdDate, intl),
    updatedBy: userMap[order.metadata?.updatedByUserId]?.username ?? invalidReference,
    dateUpdated: formatDateTime(order.metadata?.updatedDate, intl),
  };
};

const getOrderLineExportData = ({
  acquisitionMethodsMap,
  customFields,
  expenseClassMap,
  contributorNameTypeMap,
  holdingMap,
  identifierTypeMap,
  intl,
  lineRecord,
  locationMap,
  materialTypeMap,
  poLinesMap,
  userMap,
  vendorMap,
}) => {
  const invalidReference = intl.formatMessage({ id: 'ui-orders.export.invalidReference' });
  const materialSupplier = lineRecord.physical?.materialSupplier;
  const materialType = lineRecord.physical?.materialType;
  const accessProvider = lineRecord.eresource?.accessProvider;
  const materialTypeEl = lineRecord.eresource?.materialType;

  return {
    sourceRecord: lineRecord,
    poLineNumber: lineRecord.poLineNumber,
    titleOrPackage: lineRecord.titleOrPackage,
    instanceId: lineRecord.instanceId,
    subscriptionFrom: formatDate(lineRecord.details?.subscriptionFrom, intl),
    subscriptionTo: formatDate(lineRecord.details?.subscriptionTo, intl),
    subscriptionInterval: lineRecord.details?.subscriptionInterval,
    receivingNote: lineRecord.details?.receivingNote,
    publisher: lineRecord.publisher,
    edition: lineRecord.edition,
    packagePoLineId: poLinesMap[lineRecord.packagePoLineId]?.poLineNumber || lineRecord.packagePoLineId,
    contributor: getContributorData(lineRecord, contributorNameTypeMap, invalidReference),
    productIdentifier: getProductIdData(lineRecord, identifierTypeMap, invalidReference),
    renewalNote: lineRecord.renewalNote,
    description: lineRecord.description,
    acquisitionMethod: acquisitionMethodsMap[lineRecord.acquisitionMethod]?.value,
    orderFormat: lineRecord.orderFormat,
    receiptDate: formatDate(lineRecord.receiptDate, intl),
    receiptStatus: lineRecord.receiptStatus,
    paymentStatus: lineRecord.paymentStatus,
    source: lineRecord.source,
    donor: lineRecord.donor,
    selector: lineRecord.selector,
    requester: lineRecord.requester,
    cancellationRestriction: lineRecord.cancellationRestriction,
    cancellationRestrictionNote: lineRecord.cancellationRestrictionNote,
    rush: lineRecord.rush,
    collection: lineRecord.collection,
    poLineDescription: lineRecord.poLineDescription,
    refNumber: getReferenceNumbers(lineRecord),
    instructions: lineRecord.vendorDetail?.instructions,
    vendorAccount: lineRecord.vendorDetail?.vendorAccount,
    listUnitPrice: lineRecord.cost?.listUnitPrice,
    quantityPhysical: lineRecord.cost?.quantityPhysical,
    listUnitPriceElectronic: lineRecord.cost?.listUnitPriceElectronic,
    quantityElectronic: lineRecord.cost?.quantityElectronic,
    discount: `"${lineRecord.cost?.discount || ''}""${lineRecord.cost?.discountType || ''}"`,
    poLineEstimatedPrice: lineRecord.cost?.poLineEstimatedPrice,
    currency: lineRecord.cost?.currency,
    fundDistribution: getFundDistributionData(lineRecord, expenseClassMap, invalidReference),
    location: getLocationData(lineRecord, locationMap, holdingMap, invalidReference),
    materialSupplier: materialSupplier && (vendorMap[materialSupplier]?.code ?? invalidReference),
    receiptDue: formatDate(lineRecord.physical?.receiptDue, intl),
    expectedReceiptDate: formatDate(lineRecord.physical?.expectedReceiptDate, intl),
    volumes: lineRecord.physical?.volumes.join('|'),
    createInventory: lineRecord.physical?.createInventory,
    materialType: materialType && (materialTypeMap[materialType]?.name ?? invalidReference),
    accessProvider: accessProvider && (vendorMap[accessProvider]?.code ?? invalidReference),
    activated: lineRecord.eresource?.activated,
    activationDue: formatDate(lineRecord.eresource?.activationDue, intl),
    createInventoryE: lineRecord.eresource?.createInventory,
    materialTypeE: materialTypeEl && (materialTypeMap[materialTypeEl]?.name ?? invalidReference),
    trial: lineRecord.eresource?.trial,
    expectedActivation: formatDate(lineRecord.eresource?.expectedActivation, intl),
    userLimit: lineRecord.eresource?.userLimit,
    resourceUrl: lineRecord.eresource?.resourceUrl,
    poLineTags: lineRecord.tags?.tagList?.join('|'),
    exchangeRate: lineRecord.cost?.exchangeRate,
    customFields: resolveCustomFields(lineRecord.customFields, customFields),
    poLineCreatedBy: userMap[lineRecord.metadata?.createdByUserId]?.username ?? invalidReference,
    poLineDateCreated: formatDateTime(lineRecord.metadata?.createdDate, intl),
    poLineUpdatedBy: userMap[lineRecord.metadata?.updatedByUserId]?.username ?? invalidReference,
    poLineDateUpdated: formatDateTime(lineRecord.metadata?.updatedDate, intl),
  };
};

const getExportRow = ({
  order,
  lineRecord,
  intl,
  acquisitionMethodsMap,
  acqUnitMap,
  addressMap,
  contributorNameTypeMap,
  customFields,
  expenseClassMap,
  holdingMap,
  identifierTypeMap,
  locationMap,
  materialTypeMap,
  organizationTypeMap,
  poLinesMap,
  userMap,
  vendorMap,
}) => {
  const orderExportData = getOrderExportData({
    acqUnitMap,
    addressMap,
    customFields,
    intl,
    order,
    organizationTypeMap,
    userMap,
    vendorMap,
  });

  const orderLineExportData = lineRecord
    ? getOrderLineExportData({
      acquisitionMethodsMap,
      customFields,
      expenseClassMap,
      contributorNameTypeMap,
      holdingMap,
      identifierTypeMap,
      intl,
      lineRecord,
      locationMap,
      materialTypeMap,
      poLinesMap,
      vendorMap,
      userMap,
    })
    : {};

  // merge by merging same keys ('customFields' may be present in both objects)
  return merge(orderExportData, orderLineExportData);
};

const buildExportRows = ({
  order,
  groupedOrderLines,
  ...params
}) => {
  const poLines = groupedOrderLines[order.id];

  return poLines?.length
    ? poLines.map((lineRecord) => getExportRow({ order, lineRecord, ...params }))
    : [getExportRow({ order, ...params })];
};

export const createExportReport = (
  intl,
  poLines = [],
  orders = [],
  customFields = [],
  vendors = [],
  users = [],
  acqUnits = [],
  materialTypes = [],
  locations = [],
  holdings = [],
  contributorNameTypes = [],
  identifierTypes = [],
  expenseClasses = [],
  addresses = [],
  acquisitionMethods = [],
  organizationTypes = [],
) => {
  const poLinesMap = getRecordMap(poLines);
  const vendorMap = getRecordMap(vendors);
  const organizationTypeMap = getRecordMap(organizationTypes);
  const userMap = getRecordMap(users);
  const acqUnitMap = getRecordMap(acqUnits);
  const materialTypeMap = getRecordMap(materialTypes);
  const locationMap = getRecordMap(locations);
  const holdingMap = getRecordMap(holdings);
  const contributorNameTypeMap = getRecordMap(contributorNameTypes);
  const identifierTypeMap = getRecordMap(identifierTypes);
  const expenseClassMap = getRecordMap(expenseClasses);
  const addressMap = getRecordMap(addresses);
  const acquisitionMethodsMap = getRecordMap(acquisitionMethods);
  const groupedOrderLines = groupBy(poLines, 'purchaseOrderId');

  const exportRows = orders.map((order) => buildExportRows({
    order,
    intl,
    groupedOrderLines,
    acquisitionMethodsMap,
    acqUnitMap,
    addressMap,
    contributorNameTypeMap,
    expenseClassMap,
    holdingMap,
    identifierTypeMap,
    locationMap,
    materialTypeMap,
    organizationTypeMap,
    poLinesMap,
    userMap,
    vendorMap,
    customFields,
  }));

  return flatten(exportRows);
};
