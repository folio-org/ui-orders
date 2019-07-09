import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.contributorNameTypes)) {
      return {
        contributorNameTypes: json.contributorNameTypes,
        totalRecords: json.contributorNameTypes.length,
      };
    }

    return json.contributorNameTypes;
  },
});
