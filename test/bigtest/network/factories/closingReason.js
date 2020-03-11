import { Factory } from 'miragejs';
import faker from 'faker';

import { CLOSING_REASONS_SOURCE } from '../../../../src/common/constants';

export default Factory.extend({
  id: faker.id,
  reason: faker.lorem.sentence,
  source: () => CLOSING_REASONS_SOURCE.user,
});
