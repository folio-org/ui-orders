import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { SUFFIXES_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'suffixes';

export const configSuffixes = (server) => {
  server.get(SUFFIXES_API, createGetAll(SCHEMA_NAME));
  server.get(`${SUFFIXES_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${SUFFIXES_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${SUFFIXES_API}/:id`, 'suffix');
  server.post(SUFFIXES_API, createPost(SCHEMA_NAME));
};
