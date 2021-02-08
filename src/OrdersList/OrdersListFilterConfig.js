import {
  buildArrayFieldQuery,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import { FILTERS } from '@folio/plugin-find-po-line/FindPOLine/constants';

export const customFilterMap = {
  [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
  [FILTERS.RENEWAL_DATE]: buildDateRangeQuery.bind(null, [FILTERS.RENEWAL_DATE]),
  [FILTERS.DATE_ORDERED]: buildDateRangeQuery.bind(null, [FILTERS.DATE_ORDERED]),
  [FILTERS.CLOSE_REASON]: (filterValue) => {
    return `(${FILTERS.CLOSE_REASON}=="${filterValue}" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}")`;
  },
  [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
  [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
};
