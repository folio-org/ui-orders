import { ACQUISITION_METHODS_API } from '@folio/stripes-acq-components';
import {
  createGetAll,
  createPost,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

const SCHEMA_NAME = 'acquisitionMethods';

export const configAcqMethods = (server) => {
  server.get(ACQUISITION_METHODS_API, createGetAll(SCHEMA_NAME));
  server.post(ACQUISITION_METHODS_API, createPost(SCHEMA_NAME));
};
