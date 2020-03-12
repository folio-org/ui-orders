import { baseManifest } from '@folio/stripes-acq-components';

import {
  PREFIXES_API,
  SUFFIXES_API,
  REASONS_FOR_CLOSURE_API,
} from '../constants';

export const prefixesResource = {
  ...baseManifest,
  path: PREFIXES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'prefixes',
};

export const suffixesResource = {
  ...baseManifest,
  path: SUFFIXES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'suffixes',
};

export const reasonsForClosureResource = {
  ...baseManifest,
  path: REASONS_FOR_CLOSURE_API,
  params: {
    query: 'cql.allRecords=1 sortby reason',
  },
  records: 'reasonsForClosure',
};
