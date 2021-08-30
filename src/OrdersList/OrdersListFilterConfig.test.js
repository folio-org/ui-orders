import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { customFilterMap } from './OrdersListFilterConfig';
import { FILTERS } from './constants';

const FILTER_VALUE = 'filterValue';

test('customFilterMap close reason', () => {
  expect(customFilterMap[FILTERS.CLOSE_REASON](FILTER_VALUE)).toBe(`(${FILTERS.CLOSE_REASON}=="${FILTER_VALUE}" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}")`);
});
