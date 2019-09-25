import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.orderTemplates)) {
      return {
        orderTemplates: json.orderTemplates,
        totalRecords: json.orderTemplates.length,
      };
    }

    return json.orderTemplates;
  },
});
