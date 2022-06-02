import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { TITLES_API } from '../../constants';

export const useTitleMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: async (poLineId) => {
      const { titles } = await ky.get(TITLES_API, { searchParams: {
        limit: 1,
        query: `poLineId=${poLineId}`,
      } }).json();

      return titles?.length
        ? ky.put(`${TITLES_API}/${titles[0].id}`, { json: { ...titles[0], isAcknowledged: true } })
        : undefined;
    },
    ...options,
  });

  return {
    mutateTitle: mutateAsync,
  };
};
