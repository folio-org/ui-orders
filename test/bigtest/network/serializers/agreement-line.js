import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    return ({
      results: json.agreementLines,
      totalRecords: json.agreementLines.length,
    });
  },
});
