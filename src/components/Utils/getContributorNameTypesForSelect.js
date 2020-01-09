import { get } from 'lodash';

import { DICT_CONTRIBUTOR_NAME_TYPES } from '@folio/stripes-acq-components';

export default (resources) => get(resources, [DICT_CONTRIBUTOR_NAME_TYPES, 'records'], []).map((v) => ({
  label: v.name,
  value: v.id,
}));
