import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  poLineId: () => faker.random.uuid(),
  poLineNumber: (id) => `${id}${faker.random.alphaNumeric()}${faker.random.alphaNumeric()}${faker.random.alphaNumeric()}`,
  title: (id) => `Piece - ${id}`,
  dateOrdered: () => faker.date.past(),
  receivingNote: (poLineNumber) => `POLine Number: ${poLineNumber}`,
  receivingStatus: 'Expected',
});
