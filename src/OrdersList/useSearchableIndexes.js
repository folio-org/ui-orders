import { useMemo } from 'react';

import { useLocaleDateFormat } from '@folio/stripes-acq-components';

function useSearchableIndexes() {
  const localeDateFormat = useLocaleDateFormat();

  const searchableIndexes = useMemo(() => [
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

  return searchableIndexes;
}

export default useSearchableIndexes;
