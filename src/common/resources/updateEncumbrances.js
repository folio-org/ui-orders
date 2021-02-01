import { baseManifest } from '@folio/stripes-acq-components';

import { UPDATE_ENCUMBRANCES_API } from '../constants';

export const updateEncumbrancesResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  fetch: false,
  path: UPDATE_ENCUMBRANCES_API,
  pk: 'FAKE_PK',  // it's done to fool stripes-connect not to add cred id to the path's end.
};
