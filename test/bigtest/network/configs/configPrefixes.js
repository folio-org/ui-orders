import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { PREFIXES_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'prefixes';

export const configPrefixes = (server) => {
  server.get(PREFIXES_API, createGetAll(SCHEMA_NAME));
  server.get(`${PREFIXES_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${PREFIXES_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${PREFIXES_API}/:id`, 'prefix');
  server.post(PREFIXES_API, createPost(SCHEMA_NAME));
};
