import { chunk } from 'lodash';

import { batchFetch } from '@folio/stripes-acq-components';

export const fetchExportDataByIds = (mutator, ids, query) => {
  const batchedIds = chunk(ids, 50);

  return batchedIds.reduce((acc, nextBatch) => {
    return acc.then(prevResp => {
      return batchFetch(mutator, nextBatch, query).then(nextResp => {
        return [...prevResp, ...nextResp];
      });
    });
  }, Promise.resolve([]));
};
