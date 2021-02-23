import { generateQueryTemplate } from '@folio/stripes-acq-components';

const indexes = [
  'contributors',
  'poLineNumber',
  'requester',
  'titleOrPackage',
  'publisher',
  'vendorDetail.vendorAccount',
  'vendorDetail.referenceNumbers',
  'donor',
  'selector',
  'physical.volumes',
  'details.productIds',
];

export const indexISBN = {
  labelId: 'ui-orders.search.productIdISBN',
  value: 'productIdISBN',
};

export const searchableIndexes = [
  {
    labelId: 'ui-orders.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-orders.search.${index}`, value: index })),
  indexISBN,
];

export const queryTemplate = generateQueryTemplate(indexes);

export const getKeywordQuery = query => indexes.reduce(
  (acc, sIndex) => {
    if (acc) {
      return `${acc} or ${sIndex}=="*${query}*"`;
    } else {
      return `${sIndex}=="*${query}*"`;
    }
  },
  '',
);
