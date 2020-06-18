import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  startDate: faker.date.past,
  endDate: faker.date.future,
  owner: {
    id: faker.random.uuid,
    name: faker.commerce.product,
    agreementStatus: {
      value: 'active',
      label: 'Active',
    },
  },
});
