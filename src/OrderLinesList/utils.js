import {
  uniq,
  chunk,
} from 'lodash';

import { getFullName } from '@folio/stripes/util';
import {
  buildArrayFieldQuery,
  batchFetch,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import {
  FILTERS,
} from './constants';
import {
  getKeywordQuery,
} from './OrdersLinesSearchConfig';

function defaultSearchFn(query, qindex) {
  if (qindex) {
    return `(${qindex}==*${query}*)`;
  }

  return getKeywordQuery(query);
}

export const buildOrderLinesQuery = (queryParams, isbnId, normalizedISBN) => {
  const searchFn = normalizedISBN
    ? () => `details.productIds all \\"productId\\": \\"${normalizedISBN}\\"  AND details.productIds all  \\"productIdType\\": \\"${isbnId}\\"`
    : defaultSearchFn;

  const queryParamsFilterQuery = buildFilterQuery(
    queryParams,
    searchFn,
    {
      [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
      [FILTERS.EXPECTED_ACTIVATION_DATE]: buildDateRangeQuery.bind(null, [FILTERS.EXPECTED_ACTIVATION_DATE]),
      [FILTERS.SUBSCRIPTION_FROM]: buildDateRangeQuery.bind(null, [FILTERS.SUBSCRIPTION_FROM]),
      [FILTERS.SUBSCRIPTION_TO]: buildDateRangeQuery.bind(null, [FILTERS.SUBSCRIPTION_TO]),
      [FILTERS.ACTUAL_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.ACTUAL_RECEIPT_DATE]),
      [FILTERS.EXPECTED_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.EXPECTED_RECEIPT_DATE]),
      [FILTERS.RECEIPT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.RECEIPT_DUE]),
      [FILTERS.CLAIM_SENT]: buildDateRangeQuery.bind(null, [FILTERS.CLAIM_SENT]),
      [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
      [FILTERS.FUND_CODE]: buildArrayFieldQuery.bind(null, [FILTERS.FUND_CODE]),
      [FILTERS.LOCATION]: buildArrayFieldQuery.bind(null, [FILTERS.LOCATION]),
    },
  );

  const filterQuery = queryParamsFilterQuery || 'cql.allRecords=1';
  const sortingQuery = buildSortingQuery(queryParams) || 'sortby poLineNumber/sort.descending';

  return connectQuery(filterQuery, sortingQuery);
};

export const fetchLinesOrders = (mutator, lines, fetchedOrdersMap) => {
  const unfetched = lines
    .filter(({ purchaseOrderId }) => !fetchedOrdersMap[purchaseOrderId])
    .map(({ purchaseOrderId }) => purchaseOrderId)
    .filter(Boolean);

  const fetchPromise = unfetched.length
    ? batchFetch(mutator, uniq(unfetched))
    : Promise.resolve([]);

  return fetchPromise;
};

export const fetchReportDataByIds = async (mutator, ids) => {
  const batchedIds = chunk(ids, 50);

  return batchedIds.reduce((acc, nextBatch) => {
    return acc.then(prevResp => {
      return batchFetch(mutator, nextBatch).then(nextResp => {
        return [...prevResp, ...nextResp];
      });
    });
  }, Promise.resolve([]));
};

export const fetchReportOrderLinesData = async (linesMutator, query) => {
  const limit = 1000;
  const data = [];
  let offset = 0;
  let hasData = true;

  while (hasData) {
    try {
      linesMutator.reset();
      // eslint-disable-next-line no-await-in-loop
      const { poLines } = await linesMutator.GET({
        params: {
          query,
          limit,
          offset,
        },
      });

      hasData = poLines.length;
      offset += limit;
      if (hasData) {
        data.push(...poLines);
      }
    } catch (e) {
      hasData = false;
    }
  }

  return data;
};

export const getExportData = (
  poLines,
  orders,
  vendors,
  users,
  acqUnits,
) => {
  const poLinesMap = poLines.reduce((acc, line) => {
    acc[line.id] = line;

    return acc;
  }, {});
  const ordersMap = orders.reduce((acc, order) => {
    acc[order.id] = order;

    return acc;
  }, {});
  const vendorMap = vendors.reduce((acc, vendor) => {
    acc[vendor.id] = vendor;

    return acc;
  }, {});
  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;

    return acc;
  }, {});
  const acqUnitMap = acqUnits.reduce((acc, unit) => {
    acc[unit.id] = unit;

    return acc;
  }, {});

  return poLines.map(lineRecord => ({
    'PO number': ordersMap[lineRecord.purchaseOrderId].poNumber,
    'Vendor': vendorMap[ordersMap[lineRecord.purchaseOrderId].vendor].code,
    'Order type': ordersMap[lineRecord.purchaseOrderId].orderType,
    'Acquisition Units': ordersMap[lineRecord.purchaseOrderId].acqUnitIds.map(id => acqUnitMap[id].name).join('|'),
    'Approval date': ordersMap[lineRecord.purchaseOrderId].approvalDate,
    'Assigned to': getFullName(userMap[ordersMap[lineRecord.purchaseOrderId].assignedTo]),
    'Bill to': ordersMap[lineRecord.purchaseOrderId].billTo,
    'Ship to': ordersMap[lineRecord.purchaseOrderId].shipTo,
    'Manual': ordersMap[lineRecord.purchaseOrderId].manualPo,
    'Re-encumber': ordersMap[lineRecord.purchaseOrderId].reEncumber,
    'Created by': getFullName(userMap[ordersMap[lineRecord.purchaseOrderId].metadata?.createdByUserId]),
    'Created on': ordersMap[lineRecord.purchaseOrderId].metadata?.createdDate.toLocaleDateString(),
    'Note': ordersMap[lineRecord.purchaseOrderId].notes?.join('|'),
    'Workflow status': ordersMap[lineRecord.purchaseOrderId].workflowStatus,
    'Approved': ordersMap[lineRecord.purchaseOrderId].approved,
    'Total units': ordersMap[lineRecord.purchaseOrderId].totalItems,
    'Total estimated price': ordersMap[lineRecord.purchaseOrderId].totalEstimatedPrice,
    'POLine number': lineRecord.poLineNumber,
    'Title': lineRecord.titleOrPackage,
    'Subscription from': lineRecord.subscriptionFrom,
    'Subscription to': lineRecord.subscriptionTo,
    'Subscription interval': lineRecord.subscriptionInterval,
    'Receiving note': lineRecord.details?.receivingNote,
    'Publisher': lineRecord.publisher,
    'Edition': lineRecord.Edition,
    'Linked package': poLinesMap[lineRecord.packagePoLineId].poLineNumber,
    'Internal note': lineRecord.description,
    'Acquisition method': lineRecord.acquisitionMethod,
    'Order format': lineRecord.orderFormat,
    'Created on (PO Line)': lineRecord.metadata?.createdDate,
    'Receipt date': lineRecord.receiptDate,
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
    'Estimated price': lineRecord.cost?.poLineEstimatedPrice,
    'Material supplier': lineRecord.physical?.materialSupplier,
    'Receipt due': lineRecord.physical?.receiptDue,
    'Expected receipt date': lineRecord.physical?.expectedReceiptDate,
    'Volumes': lineRecord.physical?.volumes.join('|'),
    'Create inventory': lineRecord.physical?.createInventory,
    'Material type': lineRecord.physical?.materialType,
  }));
};
