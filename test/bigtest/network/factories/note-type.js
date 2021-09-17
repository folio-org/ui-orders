import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  name: faker.commerce.productName,
  metadata: {
    createdByUserId: faker.datatype.uuid,
    createdByUsername: faker.name.firstName,
    createdDate: () => faker.date.past(2),
    updatedByUserId: faker.datatype.uuid,
    updatedDate: () => faker.date.past(1),
  },
  usage: {
    noteTotal: 0,
  },
});
