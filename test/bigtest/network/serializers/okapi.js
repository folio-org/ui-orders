import { pluralize } from 'miragejs';
import camelCase from 'lodash/camelCase';

import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(...args) {
    const { modelName } = args[0];
    const collectionName = pluralize(camelCase(modelName));
    const name = this.name || collectionName;
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    const data = json[collectionName];

    return {
      [name]: data,
      totalRecords: data.length,
    };
  },
});
