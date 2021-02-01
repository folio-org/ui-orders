import { baseManifest } from '@folio/stripes-acq-components';

import { UPDATE_ENCUMBRANCES_API } from '../constants';

export const updateEncumbrancesResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: UPDATE_ENCUMBRANCES_API,
};
