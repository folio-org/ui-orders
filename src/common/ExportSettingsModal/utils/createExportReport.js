import moment from 'moment';

import { getFullName } from '@folio/stripes/util';
import {
  DATE_FORMAT,
  calculateFundAmount,
} from '@folio/stripes-acq-components';

const DATE_TIME_FORMAT = 'YYYY/MM/DD, HH:mm A';

const getRecordMap = (records) => (
  records.reduce((acc, record) => {
    acc[record.id] = record;

    return acc;
  }, {})
);

const formatDate = (date, format = DATE_FORMAT) => {
  if (!date) return null;

  const momentDate = moment.utc(date);

  return momentDate.isValid() ? momentDate.format(format) : null;
};

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
    'PO number': ordersMap[lineRecord.purchaseOrderId].poNumber,
    'Vendor': vendorMap[ordersMap[lineRecord.purchaseOrderId].vendor].code,
    'Order type': ordersMap[lineRecord.purchaseOrderId].orderType,
    'Acquisition Units': ordersMap[lineRecord.purchaseOrderId].acqUnitIds.map(id => acqUnitMap[id].name).join(' | '),
    'Approval date': formatDate(ordersMap[lineRecord.purchaseOrderId].approvalDate, DATE_TIME_FORMAT),
    'Assigned to': getFullName(userMap[ordersMap[lineRecord.purchaseOrderId].assignedTo]),
    'Bill to': addressMap[ordersMap[lineRecord.purchaseOrderId]?.billTo]?.address,
    'Ship to': addressMap[ordersMap[lineRecord.purchaseOrderId]?.shipTo]?.address,
    'Manual': ordersMap[lineRecord.purchaseOrderId].manualPo,
    'Re-encumber': ordersMap[lineRecord.purchaseOrderId].reEncumber,
    'Created by': getFullName(userMap[ordersMap[lineRecord.purchaseOrderId].metadata?.createdByUserId]),
    'Created on': formatDate(ordersMap[lineRecord.purchaseOrderId].metadata?.createdDate, DATE_TIME_FORMAT),
    'Note': ordersMap[lineRecord.purchaseOrderId].notes?.join('|'),
    'Workflow status': ordersMap[lineRecord.purchaseOrderId].workflowStatus,
    'Approved': ordersMap[lineRecord.purchaseOrderId].approved,
    'Total units': ordersMap[lineRecord.purchaseOrderId].totalItems,
    'Total estimated price': ordersMap[lineRecord.purchaseOrderId].totalEstimatedPrice,
    'POLine number': lineRecord.poLineNumber,
    'Title': lineRecord.titleOrPackage,
    'Subscription from': formatDate(lineRecord.subscriptionFrom),
    'Subscription to': formatDate(lineRecord.subscriptionTo),
    'Subscription interval': lineRecord.subscriptionInterval,
    'Receiving note': lineRecord.details?.receivingNote,
    'Publisher': lineRecord.publisher,
    'Edition': lineRecord.Edition,
    'Linked package': poLinesMap[lineRecord.packagePoLineId]?.poLineNumber,
    'Contributor - Contributor type': getContributorData(lineRecord, contributorNameTypeMap),
    'Product identifiers - Qualifier - Product ID type': getProductIdData(lineRecord, identifierTypeMap),
    'Acquisition method': lineRecord.acquisitionMethod,
    'Order format': lineRecord.orderFormat,
    'Created on (PO Line)': formatDate(lineRecord.metadata?.createdDate),
    'Receipt date': formatDate(lineRecord.receiptDate),
    'Receipt status': lineRecord.receiptStatus,
    'Payment status': lineRecord.paymentStatus,
    'Source': lineRecord.source,
    'Donor': lineRecord.donor,
    'Selector': lineRecord.selector,
    'Requester': lineRecord.requester,
    'Cancellation restriction': lineRecord.cancellationRestriction,
    'Cancellation description': lineRecord.cancellationRestrictionNote,
    'Rush': lineRecord.rush,
    'Collection': lineRecord.collection,
    'Line description': lineRecord.poLineDescription,
    'Instrucitons to vendor': lineRecord.vendorDetail?.instructions,
    'Account number': lineRecord.vendorDetail?.vendorAccount,
    'Physical unit price': lineRecord.cost?.listUnitPrice,
    'Quantity physical': lineRecord.cost?.quantityPhysical,
    'Electronic unit price': lineRecord.cost?.listUnitPriceElectronic,
    'Quantity electronic': lineRecord.cost?.quantityElectronic,
    'Discount': lineRecord.cost?.discount,
    'Estimated price': lineRecord.cost.poLineEstimatedPrice,
    'Fund - Expense class - Value - Amount': getFundDistributionData(lineRecord, expenseClassMap),
    'Location - Quantity physical - Quantity electronic': getLocationData(lineRecord, locationMap),
    'Material supplier': vendorMap[lineRecord.physical?.accessProvider]?.name,
    'Receipt due': formatDate(lineRecord.physical?.receiptDue),
    'Expected receipt date': formatDate(lineRecord.physical?.expectedReceiptDate),
    'Volumes': lineRecord.physical?.volumes.join('|'),
    'Create inventory': lineRecord.physical?.createInventory,
    'Material type': materialTypeMap[lineRecord.physical?.materialType]?.name,
    'Access provider': vendorMap[lineRecord.eresource?.accessProvider]?.name,
    'Activation status': lineRecord.eresource?.activated,
    'Activation due': formatDate(lineRecord.eresource?.activationDue),
    'Create inventory E': lineRecord.eresource?.createInventory,
    'Material type E': materialTypeMap[lineRecord.eresource?.materialType]?.name,
    'Trial': lineRecord.eresource?.trial,
    'Expected activation': formatDate(lineRecord.eresource?.expectedActivation),
    'User limit': lineRecord.eresource?.userLimit,
    'URL': lineRecord.eresource?.resourceUrl,
  }));
};
