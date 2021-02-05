import { useCallback } from 'react';

import {
  makeQueryBuilder,
  useLocaleDateFormat,
} from '@folio/stripes-acq-components';

import { makeSearchQuery } from './OrdersListSearchConfig';
import { customFilterMap } from './OrdersListFilterConfig';

function useBuildQuery() {
  const localeDateFormat = useLocaleDateFormat();

  const buildQuery = useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    makeSearchQuery(localeDateFormat),
    'sortby poNumber/sort.descending',
    customFilterMap,
  ), [localeDateFormat]);

  return buildQuery;
}

export default useBuildQuery;
