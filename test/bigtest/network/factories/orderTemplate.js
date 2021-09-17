import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  templateName: faker.finance.accountName,
  templateCode: faker.finance.accountName,
  orderFormat: () => 'Other',
});
