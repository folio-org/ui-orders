import { baseManifest } from '@folio/stripes-acq-components';

import { LOAN_TYPES_API } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const LOAN_TYPES = {
  ...baseManifest,
  path: LOAN_TYPES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'loantypes',
};
