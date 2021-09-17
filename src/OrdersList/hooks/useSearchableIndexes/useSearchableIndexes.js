import { useMemo } from 'react';

import { useLocaleDateFormat } from '@folio/stripes-acq-components';

export function useSearchableIndexes() {
  const localeDateFormat = useLocaleDateFormat();

  return useMemo(() => [
    {
      labelId: 'ui-orders.search.keyword',
      value: '',
    },
    {
      labelId: 'ui-orders.search.metadata.createdDate',
      value: 'metadata.createdDate',
      placeholder: localeDateFormat,
    },
    {
      labelId: 'ui-orders.search.dateOrdered',
      value: 'dateOrdered',
      placeholder: localeDateFormat,
    },
    {
      labelId: 'ui-orders.search.poNumber',
      value: 'poNumber',
    },
  ], [localeDateFormat]);
}
