import { Factory } from 'miragejs';
import faker from 'faker';

import { NOTE_TYPES } from '../../../../src/common/constants';

export default Factory.extend({
  id: faker.datatype.uuid,
  title: faker.commerce.productName,
  type: () => NOTE_TYPES.poLine,
  domain: () => 'orders',
  content: faker.lorem.paragraph,
  creator: {
    lastName: faker.name.lastName,
    firstName: faker.name.firstName,
  },
  metadata: {
    createdDate: () => faker.date.past(2),
    createdByUserId: faker.datatype.uuid,
    createdByUsername: faker.name.firstName,
    updatedByUserId: faker.datatype.uuid,
    updatedDate: () => faker.date.past(1),
  },
  links: () => [],
});
