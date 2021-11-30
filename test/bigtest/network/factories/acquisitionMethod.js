import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  value: faker.random.word,
  source: 'System',
  metadata: {
    createdDate: faker.date.past,
    updatedDate: faker.date.past,
  },
});
