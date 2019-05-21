import { get } from 'lodash';

export default (resources) => get(resources, ['identifierTypes', 'records'], []).map(({ id, name }) => ({
  id,
  label: name,
  value: name,
}));
