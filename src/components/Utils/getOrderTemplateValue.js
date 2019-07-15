import { get } from 'lodash';

export default (resources, id) => {
  const orderTemplates = get(resources, 'orderTemplates.records', []);
  const template = orderTemplates.find(orderTemplate => orderTemplate.id === id);

  return JSON.parse(get(template, 'value', '{}'));
};
