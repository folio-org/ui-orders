import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { REASONS_FOR_CLOSURE_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'closingReasons';

export const configClosingReasons = (server) => {
  server.get(REASONS_FOR_CLOSURE_API, createGetAll(SCHEMA_NAME));
  server.get(`${REASONS_FOR_CLOSURE_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${REASONS_FOR_CLOSURE_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${REASONS_FOR_CLOSURE_API}/:id`, 'closingReason');
  server.post(REASONS_FOR_CLOSURE_API, createPost(SCHEMA_NAME));
};
