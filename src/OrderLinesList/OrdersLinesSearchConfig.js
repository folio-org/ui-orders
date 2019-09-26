import { generateQueryTemplate } from '@folio/stripes-acq-components';

const indexes = [
  'contributors',
  'poLineNumber',
  'requester',
  'title',
  'publisher',
  'vendorDetail.vendorAccount',
  'vendorDetail.refNumber',
  'donor',
  'selector',
  'physical.volumes',
  'details.productIds',
];

const keywordIndex = {
  label: 'keyword',
  value: '',
};

export const indexISBN = {
  label: 'productIdISBN',
  prefix: '- ',
  value: 'productIdISBN',
  queryTemplate: 'details.productIds == "*\\"productId\\": \\"<%= normalizedISBNValue %>\\", \\"productIdType\\": \\"<%= identifierTypeId %>\\"*"',
};

export const searchableIndexes = [
  keywordIndex,
  ...indexes.map(index => ({ label: index, value: index })),
  indexISBN,
];

export const queryTemplate = generateQueryTemplate(indexes);
