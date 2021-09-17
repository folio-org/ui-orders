import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.datatype.uuid,
  folioInvoiceNo: faker.datatype.number,
  currency: () => 'USD',
  total: () => Number(faker.finance.amount),
});
