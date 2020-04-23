import { get } from 'lodash';
import { DICT_FUNDS } from '@folio/stripes-acq-components';

// eslint-disable-next-line import/prefer-default-export
export const getFundOptions = (resources) => get(resources, [DICT_FUNDS, 'records'], []).map(fund => ({
  value: fund.id,
  label: fund.code,
}));
