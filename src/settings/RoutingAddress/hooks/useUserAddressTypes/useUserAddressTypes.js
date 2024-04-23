import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { USER_ADDRESS_TYPES_API } from '../../../../common/constants';

const DEFAULT_DATA = [];

export const useUserAddressTypes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const searchParams = {
    query: 'cql.allRecords=1 sortby addressType',
  };

  const {
    isLoading,
    data = {},
  } = useQuery(
    [namespace, 'user-address-types'],
    () => ky.get(USER_ADDRESS_TYPES_API, { searchParams }).json(),
    options,
  );

  return ({
    addressTypes: data?.addressTypes || DEFAULT_DATA,
    isLoading,
  });
};
