import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VENDORS_API } from '@folio/stripes-acq-components';

export const useVendor = (vendorId) => {
  const ky = useOkapiKy();

  const { isLoading, data } = useQuery(
    ['ui-orders', 'vendor', vendorId],
    ({ signal }) => ky.get(`${VENDORS_API}/${vendorId}`, { signal }).json(),
    { enabled: Boolean(vendorId) },
  );

  return ({
    vendor: data,
    isLoading,
  });
};
