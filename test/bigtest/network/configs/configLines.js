import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { LINES_API } from '../../../../src/components/Utils/api';

const SCHEMA_NAME = 'lines';

function configLines(server) {
  server.get(LINES_API, createGetAll(SCHEMA_NAME));
  server.get(`${LINES_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${LINES_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${LINES_API}/:id`, 'line');
  server.post(`${LINES_API}`, createPost(SCHEMA_NAME));
}

export default configLines;
