import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { TEMPLATES_API } from '../../../../common/constants/api';
import { LIST_CONFIGURATION_TEMPLATE_ID } from '../../constants';

export const useListConfiguration = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const { isFetching, data, refetch } = useQuery(
    [namespace, LIST_CONFIGURATION_TEMPLATE_ID],
    () => ky.get(`${TEMPLATES_API}/${LIST_CONFIGURATION_TEMPLATE_ID}`).json(),
  );

  return ({
    isLoading: isFetching,
    listConfig: data,
    refetch,
  });
};
