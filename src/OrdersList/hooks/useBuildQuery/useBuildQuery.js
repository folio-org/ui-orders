import {
  useCallback,
  useMemo,
} from 'react';

import {
  makeQueryBuilder,
  useLocaleDateFormat,
  buildArrayFieldQuery,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import { makeSearchQuery } from '../../OrdersListSearchConfig';
import {
  CUSTOM_FIELD_TYPES,
  FILTERS,
} from '../../constants';

export function useBuildQuery(customFields) {
  const localeDateFormat = useLocaleDateFormat();

  const customFieldsFilterMap = useMemo(() => {
    const result = {};

    if (customFields) {
      customFields.forEach((cf) => {
        const fieldName = `${FILTERS.CUSTOM_FIELDS}.${cf.refId}`;

        if (cf.type === CUSTOM_FIELD_TYPES.MULTI_SELECT_DROPDOWN) {
          result[fieldName] = buildArrayFieldQuery.bind(null, fieldName);
        } else if (cf.type === CUSTOM_FIELD_TYPES.DATE_PICKER) {
          result[fieldName] = buildDateTimeRangeQuery.bind(null, fieldName);
        }
      });
    }

    return result;
  }, [customFields]);

  return useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    makeSearchQuery(localeDateFormat, customFields),
    'sortby metadata.updatedDate/sort.descending',
    {
      [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
      [FILTERS.RENEWAL_DATE]: buildDateRangeQuery.bind(null, [FILTERS.RENEWAL_DATE]),
      [FILTERS.DATE_ORDERED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_ORDERED]),
      [FILTERS.CLOSE_REASON]: (filterValue) => {
        return `(${FILTERS.CLOSE_REASON}=="${filterValue}" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}")`;
      },
      [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
      [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
      ...customFieldsFilterMap,
    },
  ),
  [customFieldsFilterMap, localeDateFormat]);
}
