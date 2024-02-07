import { get } from 'lodash';

import { DICT_IDENTIFIER_TYPES } from '@folio/stripes-acq-components';

import {
  PRODUCT_ID_TYPE,
} from '../../common/constants';

const ALLOWED_RES_ID_TYPE_NAMES = [
  PRODUCT_ID_TYPE.asin,
  PRODUCT_ID_TYPE.coden,
  PRODUCT_ID_TYPE.doi,
  PRODUCT_ID_TYPE.gpoItemNumber,
  PRODUCT_ID_TYPE.isbn,
  PRODUCT_ID_TYPE.ismn,
  PRODUCT_ID_TYPE.issn,
  PRODUCT_ID_TYPE.lccn,
  PRODUCT_ID_TYPE.publisherOrDistributorNumber,
  PRODUCT_ID_TYPE.reportNumber,
  PRODUCT_ID_TYPE.standardTechnicalReportNumber,
  PRODUCT_ID_TYPE.upc,
  PRODUCT_ID_TYPE.urn,
];

export default (resources) => get(resources, [DICT_IDENTIFIER_TYPES, 'records'], [])
  .filter(({ name }) => ALLOWED_RES_ID_TYPE_NAMES.includes(name))
  .map(({ id, name }) => ({
    label: name,
    value: id,
  }));
