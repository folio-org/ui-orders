import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  poNumber: (id) => `${id}${faker.random.alphaNumeric()}${faker.random.alphaNumeric()}${faker.random.alphaNumeric()}`,
  metadata: () => ({
    createdDate: faker.date.past(),
    updatedDate: faker.date.past(),
  }),
  notes: (id) => [`Order ${id}`],
});
