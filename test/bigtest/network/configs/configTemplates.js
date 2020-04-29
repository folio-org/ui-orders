import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { ORDER_TEMPLATES_API as API } from '../../../../src/components/Utils/api';

const SCHEMA_NAME = 'orderTemplates';

export const configTemplates = (server) => {
  server.get(API, createGetAll(SCHEMA_NAME));
  server.get(`${API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${API}/:id`, 'orderTemplate');
  server.post(API, createPost(SCHEMA_NAME));
};
