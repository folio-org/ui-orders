import { instance, orderLine } from '../../../../test/jest/fixtures';
import { createTitleBody } from './utils';

it('\'createTitleBody\' should return title body created from instance and poLine', () => {
  const title = createTitleBody(instance, orderLine.id);

  expect(title.poLineId).toEqual(orderLine.id);
  expect(title.title).toEqual(instance.title);
  expect(title.contributors[0].contributor).toEqual(instance.contributors[0].name);
  expect(title.productIds[0].productId).toEqual(instance.identifiers[0].value);
  expect(title.edition).toEqual(instance.editions[0]);
  expect(title.publisher).toEqual(instance.publication[0].publisher);
  expect(title.publishedDate).toEqual(instance.publication[0].dateOfPublication);
});
