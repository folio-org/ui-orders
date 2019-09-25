import {
  get,
  sortBy,
} from 'lodash';

export default (resources) => sortBy(
  get(resources, 'orderTemplates.records', []).map(({ templateName, templateCode, id }) => {
    return {
      label: templateCode ? `${templateName} (${templateCode})` : templateName,
      value: id,
    };
  }), 'label',
);
