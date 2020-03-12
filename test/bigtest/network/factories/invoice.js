import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  folioInvoiceNo: faker.random.number,
  currency: () => 'USD',
  total: () => Number(faker.finance.amount),
});
