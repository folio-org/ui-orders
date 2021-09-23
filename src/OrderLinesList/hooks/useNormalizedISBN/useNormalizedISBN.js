import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  IDENTIFIER_TYPES_API,
} from '@folio/stripes-acq-components';

export const useNormalizedISBN = ({ isbnNumber }) => {
  const ky = useOkapiKy();

  const { refetch } = useQuery(
    ['order-lines-isbn', isbnNumber],
    async () => {
      const isbnTypeSearchParams = {
        query: '(name=="isbn")',
        limit: 1,
      };
      const isbnTypesPromise = ky.get(IDENTIFIER_TYPES_API, { searchParams: isbnTypeSearchParams }).json();
      const isbnPromise = ky.get(`isbn/convertTo13?isbn=${isbnNumber}&hyphens=false`).json();

      const [{ identifierTypes }, { isbn }] = await Promise.all([isbnTypesPromise, isbnPromise]);

      return { isbn, isbnType: identifierTypes[0]?.id };
    },
    { enabled: false },
  );

  return ({
    fetchISBN: refetch,
  });
};
