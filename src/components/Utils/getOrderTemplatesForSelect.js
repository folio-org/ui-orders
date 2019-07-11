import { get } from 'lodash';

export default (resources) => get(resources, 'orderTemplates.records', []).map((v) => {
  const { templateName, templateCode } = JSON.parse(v.value);

  return {
    label: `${templateName} (${templateCode})`,
    value: v.id,
  };
});
