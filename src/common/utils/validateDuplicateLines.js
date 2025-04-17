import { escapeCqlValue } from '@folio/stripes/util';
import { batchFetch } from '@folio/stripes-acq-components';

import { VALIDATION_ERRORS } from '../constants';

export const validateDuplicateLines = (line, mutator) => {
  const productIds = line.details?.productIds?.map(({ productId }) => productId) || [];
  const baseQuery = `id<>"${line.id}" and titleOrPackage=="*${escapeCqlValue(line.titleOrPackage)}*"`;

  return batchFetch(mutator.poLines, productIds, (itemsChunk) => {
    const query = itemsChunk
      .map(productId => `details.productIds=="*${productId}*"`)
      .join(' and ');

    return query
      ? `${baseQuery} and (${query})`
      : baseQuery;
  })
    .then((existingLines) => {
      if (existingLines.length) {
        const orderIds = [...new Set(existingLines.map(({ purchaseOrderId }) => purchaseOrderId))];

        return Promise.all([batchFetch(mutator.orders, orderIds, (itemsChunk) => (
          itemsChunk.map(purchaseOrderId => `id=="${purchaseOrderId}"`).join(' or ')
        )), existingLines]);
      }

      return Promise.resolve([]);
    })
    .then(([orders, existingLines]) => {
      if (orders?.length && existingLines?.length) {
        const orderMap = orders.reduce((acc, o) => ({ ...acc, [o.id]: o }), {});

        const duplicateLines = existingLines.map(l => ({ ...l, order: orderMap[l.purchaseOrderId] }));

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ validationError: VALIDATION_ERRORS.duplicateLines, duplicateLines });
      }

      return Promise.resolve();
    });
};
