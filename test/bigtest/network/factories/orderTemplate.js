import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  templateName: faker.finance.accountName,
  templateCode: faker.finance.accountName,
  orderFormat: 'Other',
});
