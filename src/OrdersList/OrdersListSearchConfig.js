import {
  DATE_FORMAT,
  generateQueryTemplate,
} from '@folio/stripes-acq-components';

const indexes = [
  'metadata.createdDate',
  'dateOrdered',
  'poNumber',
];

const poNumber = {
  label: 'poNumber',
  value: 'poNumber',
};

const keywordIndex = {
  label: 'keyword',
  value: '',
};

const createdDate = {
  label: 'metadata.createdDate',
  value: 'metadata.createdDate',
  placeholder: DATE_FORMAT,
};

const dateOrdered = {
  label: 'dateOrdered',
  value: 'dateOrdered',
  placeholder: DATE_FORMAT,
};

export const searchableIndexes = [keywordIndex, createdDate, dateOrdered, poNumber];
export const ordersSearchTemplate = generateQueryTemplate(indexes);
