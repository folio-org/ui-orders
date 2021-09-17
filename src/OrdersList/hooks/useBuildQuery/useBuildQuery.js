import { useCallback } from 'react';

import {
  makeQueryBuilder,
  useLocaleDateFormat,
} from '@folio/stripes-acq-components';

import { makeSearchQuery } from '../../OrdersListSearchConfig';
import { customFilterMap } from '../../OrdersListFilterConfig';

export function useBuildQuery() {
  const localeDateFormat = useLocaleDateFormat();

  const buildQuery = useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    makeSearchQuery(localeDateFormat),
    'sortby metadata.updatedDate/sort.descending',
    customFilterMap,
  ), [localeDateFormat]);

  return buildQuery;
}
