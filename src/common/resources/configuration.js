import { baseManifest } from '@folio/stripes-acq-components';

import {
  REASONS_FOR_CLOSURE_API,
} from '../constants';

export const reasonsForClosureResource = {
  ...baseManifest,
  path: REASONS_FOR_CLOSURE_API,
  params: {
    query: 'cql.allRecords=1 sortby reason',
  },
  records: 'reasonsForClosure',
};
