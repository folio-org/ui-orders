import { getKeywordQuery } from './OrdersLinesSearchConfig';

const QUERY = 'query';

it('should return keyword query', () => {
  const keywordQuery = getKeywordQuery(QUERY);

  expect(keywordQuery).toBe(`contributors=="*${QUERY}*" or poLineNumber=="*${QUERY}*" or requester=="*${QUERY}*" or titleOrPackage=="*${QUERY}*" or publisher=="*${QUERY}*" or vendorDetail.vendorAccount=="*${QUERY}*" or vendorDetail.referenceNumbers=="*${QUERY}*" or donor=="*${QUERY}*" or selector=="*${QUERY}*" or physical.volumes=="*${QUERY}*" or details.productIds=="*${QUERY}*"`);
});
