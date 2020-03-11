import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { ORDERS_API } from '../../../../src/components/Utils/api';

const SCHEMA_NAME = 'orders';

export function configOrders(server) {
  server.get(ORDERS_API, createGetAll(SCHEMA_NAME));
  server.get(`${ORDERS_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${ORDERS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${ORDERS_API}/:id`, 'order');
  server.post(ORDERS_API, createPost(SCHEMA_NAME));
}
