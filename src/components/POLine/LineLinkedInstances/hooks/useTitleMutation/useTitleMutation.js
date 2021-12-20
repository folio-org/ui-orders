import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useTitleMutation = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (title) => {
      const kyMethod = 'post';
      const kyPath = 'orders/titles';

      return ky[kyMethod](kyPath, { json: title });
    },
    ...options,
  });

  return {
    mutateTitle: mutateAsync,
  };
};
