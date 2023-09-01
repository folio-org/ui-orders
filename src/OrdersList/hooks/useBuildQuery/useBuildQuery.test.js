import queryString from 'query-string';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { FILTERS } from '../../constants';
import { useBuildQuery } from './useBuildQuery';

describe('useBuildQuery', () => {
  it('should return function, that return query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse(`?foo=bar&${FILTERS.CLOSE_REASON}=cancel`))).toBe(
      `((${FILTERS.CLOSE_REASON}=="cancel" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}") and foo=="bar") sortby metadata.updatedDate/sort.descending`,
    );
  });
});
