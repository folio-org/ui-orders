import { get } from 'lodash';

const getName = (value) => get(JSON.parse(value), 'templateName', '');

export default (resources) => get(resources, 'orderTemplates.records', []).map((v) => ({
  label: `${getName(v.value)} (${v.code})`,
  value: v.id,
}));
