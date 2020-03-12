import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  templateName: faker.finance.accountName,
  templateCode: faker.finance.accountName,
  orderFormat: () => 'Other',
});
