import {
  CONFIG_ADDRESSES,
  CONFIG_API,
  MODULE_TENANT,
} from '@folio/stripes-acq-components';

export const getTenantAddresses = (ky) => async () => {
  const searchParams = {
    query: `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES})`,
  };

  return ky.get(CONFIG_API, { searchParams }).json();
};
