// eslint-disable-next-line import/prefer-default-export
export const getAddressOptions = (addresses = []) => addresses.map(address => ({
  value: address.id,
  label: address.name,
}));
