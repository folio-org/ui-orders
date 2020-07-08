import { buildDateRangeQuery, ORDER_STATUSES } from '@folio/stripes-acq-components';

import { FILTERS } from './constants';

export const customFilterMap = {
  [FILTERS.DATE_CREATED]: buildDateRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
  [FILTERS.RENEWAL_DATE]: buildDateRangeQuery.bind(null, [FILTERS.RENEWAL_DATE]),
  [FILTERS.DATE_ORDERED]: buildDateRangeQuery.bind(null, [FILTERS.DATE_ORDERED]),
  [FILTERS.CLOSE_REASON]: (filterValue) => {
    return `(${FILTERS.CLOSE_REASON}=="${filterValue}" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}")`;
  },
};
