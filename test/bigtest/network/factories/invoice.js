import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  folioInvoiceNo: faker.random.number,
  currency: 'USD',
  total: () => Number(faker.finance.amount),
});
