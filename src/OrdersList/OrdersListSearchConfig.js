import { DATE_FORMAT } from '@folio/stripes-acq-components';

const indexes = [
  'metadata.createdDate',
  'dateOrdered',
  'poNumber',
];

const poNumber = {
  labelId: 'ui-orders.search.poNumber',
  value: 'poNumber',
};

const keywordIndex = {
  labelId: 'ui-orders.search.keyword',
  value: '',
};

const createdDate = {
  labelId: 'ui-orders.search.metadata.createdDate',
  value: 'metadata.createdDate',
  placeholder: DATE_FORMAT,
};

const dateOrdered = {
  labelId: 'ui-orders.search.dateOrdered',
  value: 'dateOrdered',
  placeholder: DATE_FORMAT,
};

export const searchableIndexes = [keywordIndex, createdDate, dateOrdered, poNumber];
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
