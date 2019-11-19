import { baseManifest } from '@folio/stripes-acq-components';

import { INSTANCE_STATUSES_API } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const INSTANCE_STATUSES = {
  ...baseManifest,
  path: INSTANCE_STATUSES_API,
  records: 'instanceStatuses',
};
