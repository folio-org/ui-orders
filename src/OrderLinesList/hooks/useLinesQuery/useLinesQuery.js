import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
} from '@folio/stripes-acq-components';

import { QUALIFIER_SEPARATOR } from '../../../common/constants';
import {
  buildOrderLinesQuery,
} from '../../utils';
import {
  useNormalizedISBN,
} from '../useNormalizedISBN';

export function useLinesQuery(queryParams) {
  const isISBNSearch = queryParams[SEARCH_INDEX_PARAMETER] === 'productIdISBN';
  const isbnNumber = queryParams[SEARCH_PARAMETER]?.split(QUALIFIER_SEPARATOR)[0];

  const { fetchISBN } = useNormalizedISBN({ isbnNumber });

  return async () => {
    const { data: isbnData, isError } = await (isISBNSearch ? fetchISBN() : Promise.resolve({}));

    if (isError) return undefined;

    return buildOrderLinesQuery(queryParams, isbnData?.isbn, isbnData?.isbnType);
  };
}
