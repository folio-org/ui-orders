import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  purchaseOrderId: faker.random.uuid,
  poLineNumber: (id) => `${id}${faker.random.alphaNumeric()}${faker.random.alphaNumeric()}${faker.random.alphaNumeric()}-${id}`,
  metadata: () => ({
    createdDate: faker.date.past(),
    updatedDate: faker.date.past(),
  }),
  contributors: [],
  details: {
    productIds: [],
  },
  receiptDate: faker.date.future(),
});
