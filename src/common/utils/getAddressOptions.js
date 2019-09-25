import { sortBy } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getAddressOptions = (addresses = []) => sortBy(
  addresses.map(address => ({
    value: address.id,
    label: address.name,
  })), 'label',
);
