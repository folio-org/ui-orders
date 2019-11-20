import { baseManifest } from '@folio/stripes-acq-components';

import { LOAN_TYPES_API } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const LOAN_TYPES = {
  ...baseManifest,
  path: LOAN_TYPES_API,
  records: 'loantypes',
};
