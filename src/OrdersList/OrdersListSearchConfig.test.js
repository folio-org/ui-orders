import { makeSearchQuery } from './OrdersListSearchConfig';

describe('makeSearchQuery', () => {
  const QUERY = 'query';

  it('should return query without qindex', () => {
    const query = makeSearchQuery()('query');

    expect(query).toBe(`metadata.createdDate=="Invalid date*" or dateOrdered=="Invalid date*" or poNumber=="*${QUERY}*"`);
  });

  it('should return query with qindex', () => {
    const query = makeSearchQuery()('query', 'qindex');

    expect(query).toBe(`(qindex==*${QUERY}*)`);
  });
});
