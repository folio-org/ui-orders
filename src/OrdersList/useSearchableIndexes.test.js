import { renderHook } from '@testing-library/react-hooks';

import useSearchableIndexes from './useSearchableIndexes';

const SEARCHABLE_INDEXES = [
  {
    'labelId': 'ui-orders.search.keyword',
    'value': '',
  },
  {
    'labelId': 'ui-orders.search.metadata.createdDate',
    'placeholder': 'MM/DD/YYYY',
    'value': 'metadata.createdDate',
  },
  {
    'labelId': 'ui-orders.search.dateOrdered',
    'placeholder': 'MM/DD/YYYY',
    'value': 'dateOrdered',
  },
  {
    'labelId': 'ui-orders.search.poNumber',
    'value': 'poNumber',
  },
];

describe('useSearchableIndexes', () => {
  it('should return array of searchable indexes', () => {
    const { result } = renderHook(() => useSearchableIndexes());

    expect(result.current).toEqual(SEARCHABLE_INDEXES);
  });
});
