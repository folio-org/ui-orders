import { getFullName } from '@folio/stripes/util';
import {
  calculateFundAmount,
  formatDate,
  formatDateTime,
} from '@folio/stripes-acq-components';

const getRecordMap = (records) => (
  records.reduce((acc, record) => {
    acc[record.id] = record;

    return acc;
  }, {})
);

const getContributorData = (line, contributorNameTypeMap) => (
  line.contributors?.map(({ contributor, contributorNameTypeId }) => (
    `${contributor} - ${contributorNameTypeMap[contributorNameTypeId]?.name}`
  )).join(' | ')
);

const getProductIdData = (line, identifierTypeMap) => (
  line.details?.productIds?.map(i => (
    `${i?.productId} - ${i?.qualifier || ''} - ${identifierTypeMap[i?.productIdType]?.name}`
  )).join(' | ')
);

const getFundDistributionData = (line, expenseClassMap) => (
  line.fundDistribution?.map(fund => (
    `${fund.code} - ${expenseClassMap[fund?.expenseClassId]?.name || ''} - ${fund.value} -
    ${calculateFundAmount(fund, line.cost.poLineEstimatedPrice, line.cost.currency)}`
  )).join(' | ')
);

const getLocationData = (line, locationMap) => (
  line.locations?.map(l => (
    `${locationMap[l.locationId]?.name} - ${l?.quantityPhysical || 0} - ${l?.quantityElectronic || 0}`
  )).join(' | ')
);

export const createExportReport = (
  intl,
  poLines = [],
  orders = [],
  vendors = [],
  users = [],
  acqUnits = [],
  materialTypes = [],
  locations = [],
  contributorNameTypes = [],
  identifierTypes = [],
  expenseClasses = [],
  addresses = [],
) => {
  const poLinesMap = getRecordMap(poLines);
  const ordersMap = getRecordMap(orders);
  const vendorMap = getRecordMap(vendors);
  const userMap = getRecordMap(users);
  const acqUnitMap = getRecordMap(acqUnits);
  const materialTypeMap = getRecordMap(materialTypes);
  const locationMap = getRecordMap(locations);
  const contributorNameTypeMap = getRecordMap(contributorNameTypes);
  const identifierTypeMap = getRecordMap(identifierTypes);
  const expenseClassMap = getRecordMap(expenseClasses);
  const addressMap = getRecordMap(addresses);

  return poLines.map(lineRecord => ({
    poNumber: ordersMap[lineRecord.purchaseOrderId].poNumber,
    vendor: vendorMap[ordersMap[lineRecord.purchaseOrderId].vendor].code,
    orderType: ordersMap[lineRecord.purchaseOrderId].orderType,
    acquisitionsUnits: ordersMap[lineRecord.purchaseOrderId].acqUnitIds.map(id => acqUnitMap[id].name).join(' | '),
    approvalDate: formatDateTime(ordersMap[lineRecord.purchaseOrderId].approvalDate, intl),
    assignedTo: getFullName(userMap[ordersMap[lineRecord.purchaseOrderId].assignedTo]),
    billTo: addressMap[ordersMap[lineRecord.purchaseOrderId]?.billTo]?.address,
    shipTo: addressMap[ordersMap[lineRecord.purchaseOrderId]?.shipTo]?.address,
    manualPo: ordersMap[lineRecord.purchaseOrderId].manualPo,
    reEncumber: ordersMap[lineRecord.purchaseOrderId].reEncumber,
    createdByUserId: getFullName(userMap[ordersMap[lineRecord.purchaseOrderId].metadata?.createdByUserId]),
    createdDate: formatDateTime(ordersMap[lineRecord.purchaseOrderId].metadata?.createdDate, intl),
    note: ordersMap[lineRecord.purchaseOrderId].notes?.join('|'),
    workflowStatus: ordersMap[lineRecord.purchaseOrderId].workflowStatus,
    approved: ordersMap[lineRecord.purchaseOrderId].approved,
    poLineNumber: lineRecord.poLineNumber,
    titleOrPackage: lineRecord.titleOrPackage,
    subscriptionFrom: formatDate(lineRecord.subscriptionFrom, intl),
    subscriptionTo: formatDate(lineRecord.subscriptionTo, intl),
    subscriptionInterval: lineRecord.subscriptionInterval,
    receivingNote: lineRecord.details?.receivingNote,
    publisher: lineRecord.publisher,
    edition: lineRecord.edition,
    packagePoLineId: poLinesMap[lineRecord.packagePoLineId]?.poLineNumber,
    contributor: getContributorData(lineRecord, contributorNameTypeMap),
    productIdentifier: getProductIdData(lineRecord, identifierTypeMap),
    acquisitionMethod: lineRecord.acquisitionMethod,
    orderFormat: lineRecord.orderFormat,
    createdDateLine: formatDate(lineRecord.metadata?.createdDate, intl),
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
    instructions: lineRecord.vendorDetail?.instructions,
    vendorAccount: lineRecord.vendorDetail?.vendorAccount,
    listUnitPrice: lineRecord.cost?.listUnitPrice,
    quantityPhysical: lineRecord.cost?.quantityPhysical,
    listUnitPriceElectronic: lineRecord.cost?.listUnitPriceElectronic,
    quantityElectronic: lineRecord.cost?.quantityElectronic,
    discount: lineRecord.cost?.discount,
    poLineEstimatedPrice: lineRecord.cost.poLineEstimatedPrice,
    fundDistribution: getFundDistributionData(lineRecord, expenseClassMap),
    location: getLocationData(lineRecord, locationMap),
    materialSupplier: vendorMap[lineRecord.physical?.accessProvider]?.name,
    receiptDue: formatDate(lineRecord.physical?.receiptDue, intl),
    expectedReceiptDate: formatDate(lineRecord.physical?.expectedReceiptDate, intl),
    volumes: lineRecord.physical?.volumes.join('|'),
    createInventory: lineRecord.physical?.createInventory,
    materialType: materialTypeMap[lineRecord.physical?.materialType]?.name,
    accessProvider: vendorMap[lineRecord.eresource?.accessProvider]?.name,
    activated: lineRecord.eresource?.activated,
    activationDue: formatDate(lineRecord.eresource?.activationDue, intl),
    createInventoryE: lineRecord.eresource?.createInventory,
    materialTypeE: materialTypeMap[lineRecord.eresource?.materialType]?.name,
    trial: lineRecord.eresource?.trial,
    expectedActivation: formatDate(lineRecord.eresource?.expectedActivation, intl),
    userLimit: lineRecord.eresource?.userLimit,
    resourceUrl: lineRecord.eresource?.resourceUrl,
  }));
};
