import { get } from 'lodash';

import { DICT_IDENTIFIER_TYPES } from '@folio/stripes-acq-components';

import {
  PRODUCT_ID_TYPE,
} from '../../common/constants';

const ALLOWED_RES_ID_TYPE_NAMES = [
  'ASIN',
  'CODEN',
  'DOI',
  'GPO item number',
  PRODUCT_ID_TYPE.isbn,
  'ISSN',
  'Publisher or distributor number',
  'Report number',
  'Standard technical report number',
  'URN',
];

export default (resources) => get(resources, [DICT_IDENTIFIER_TYPES, 'records'], [])
  .filter(({ name }) => ALLOWED_RES_ID_TYPE_NAMES.includes(name))
  .map(({ id, name }) => ({
    label: name,
    value: id,
  }));
