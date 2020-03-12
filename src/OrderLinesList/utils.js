import { uniq } from 'lodash';

import {
  batchFetch,
  buildFilterQuery,
  buildDateRangeQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import {
  FILTERS,
} from './constants';
import {
  getKeywordQuery,
} from './OrdersLinesSearchConfig';

export const fetchOrderLinesFunds = (mutator, orderLines, fetchedFundsMap) => {
  const unfetchedFunds = orderLines
    .reduce((acc, { fundDistribution = [] }) => [...acc, ...fundDistribution], [])
    .filter(({ fundId }) => !fetchedFundsMap[fundId])
    .map(({ fundId }) => fundId);

  const fetchFundsPromise = unfetchedFunds.length
    ? batchFetch(mutator, uniq(unfetchedFunds))
    : Promise.resolve([]);

  return fetchFundsPromise;
};

function defaultSearchFn(query, qindex) {
  if (qindex) {
    return `(${qindex}=${query}*)`;
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
      [FILTERS.DATE_CREATED]: buildDateRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
      [FILTERS.EXPECTED_ACTIVATION_DATE]: buildDateRangeQuery.bind(null, [FILTERS.EXPECTED_ACTIVATION_DATE]),
      [FILTERS.SUBSCRIPTION_FROM]: buildDateRangeQuery.bind(null, [FILTERS.SUBSCRIPTION_FROM]),
      [FILTERS.SUBSCRIPTION_TO]: buildDateRangeQuery.bind(null, [FILTERS.SUBSCRIPTION_TO]),
      [FILTERS.ACTUAL_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.ACTUAL_RECEIPT_DATE]),
      [FILTERS.EXPECTED_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.EXPECTED_RECEIPT_DATE]),
      [FILTERS.RECEIPT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.RECEIPT_DUE]),
      [FILTERS.CLAIM_SENT]: buildDateRangeQuery.bind(null, [FILTERS.CLAIM_SENT]),
    },
  );

  const filterQuery = queryParamsFilterQuery || 'cql.allRecords=1';
  const sortingQuery = buildSortingQuery(queryParams) || 'sortby poLineNumber/sort.descending';

  return connectQuery(filterQuery, sortingQuery);
};
