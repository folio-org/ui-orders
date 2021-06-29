import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { CONFIG_API } from '@folio/stripes-acq-components';

import {
  CONFIG_LINES_LIMIT,
  LINES_LIMIT_DEFAULT,
  MODULE_ORDERS,
} from '../../../components/Utils/const';

export const useLinesLimit = (enabled = true) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-lines-limit' });

  const searchParams = {
    query: `(module=${MODULE_ORDERS} and configName=${CONFIG_LINES_LIMIT})`,
  };

  const { isLoading, data = {} } = useQuery(
    [namespace],
    () => ky.get(CONFIG_API, { searchParams }).json(),
    { enabled },
  );

  return ({
    linesLimit: Number(data.configs?.[0]?.value) || LINES_LIMIT_DEFAULT,
    isLoading,
  });
};
