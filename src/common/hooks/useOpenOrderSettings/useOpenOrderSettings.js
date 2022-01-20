import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CONFIG_API,
  getConfigSetting,
} from '@folio/stripes-acq-components';

import {
  CONFIG_OPEN_ORDER,
  MODULE_ORDERS,
} from '../../../components/Utils/const';

export const defaultConfig = {
  isOpenOrderEnabled: false,
  isDuplicateCheckDisabled: false,
};

export const useOpenOrderSettings = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'open-order-settings' });

  const searchParams = {
    query: `(module=${MODULE_ORDERS} and configName=${CONFIG_OPEN_ORDER})`,
  };

  const { isFetching, data = {} } = useQuery(
    [namespace],
    () => ky.get(CONFIG_API, { searchParams }).json(),
    options,
  );

  return ({
    openOrderSettings: getConfigSetting(data.configs, defaultConfig),
    isFetching,
  });
};
