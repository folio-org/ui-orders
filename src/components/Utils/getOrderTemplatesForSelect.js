import {
  get,
  orderBy,
} from 'lodash';

export const getOrderTemplateLabel = ({ templateName, templateCode } = {}) => {
  return templateCode ? `${templateName} (${templateCode})` : templateName;
};

export default (resources) => orderBy(
  get(resources, 'orderTemplates.records', []).map(({ templateName, templateCode, id }) => {
    return {
      label: getOrderTemplateLabel({ templateName, templateCode }),
      value: id,
    };
  }),
  [template => template.label.toLowerCase()],
  ['asc'],
);
