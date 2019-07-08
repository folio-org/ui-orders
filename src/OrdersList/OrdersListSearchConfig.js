export const ordersSearchTemplate = `(
  poNumber="%{query.query}" OR
  metadata.createdDate="%{query.query}" OR
  dateOrdered="%{query.query}"
)`;

const indexes = [
  'metadata.createdDate',
  'dateOrdered',
  'poNumber',
];

const keywordIndex = {
  label: 'keyword',
  value: '',
};

export const searchableIndexes = [keywordIndex, ...indexes.map(index => ({ label: index, value: index }))];
