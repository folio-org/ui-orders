import { baseManifest } from '@folio/stripes-acq-components';

import { UPDATE_ENCUMBRANCES_API } from '../constants';

export const updateEncumbrancesResource = {
  ...baseManifest,
  path: UPDATE_ENCUMBRANCES_API,
  params: {
    query: 'cql.allRecords=1 sortby reason',
  },
  records: 'reasonsForClosure',
};
