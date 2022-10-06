import { escapeCqlValue } from '@folio/stripes/util';
import { batchFetch } from '@folio/stripes-acq-components';

import {
  PRODUCT_ID_TYPE,
  VALIDATION_ERRORS,
} from '../constants';

export const validateDuplicateLines = async (line, mutator, resources) => {
  const baseQuery = `id<>"${line.id}" and titleOrPackage=="*${escapeCqlValue(line.titleOrPackage)}*"`;
  const productIdentifiers = line.details?.productIds || [];
  const isbnIdentifierTypeId = (
    resources
      ?.identifierTypes
      ?.records
      ?.find(({ name }) => name === PRODUCT_ID_TYPE.isbn)
      ?.id
  );

  const isbnIdentifiers = productIdentifiers.reduce((acc, { productIdType, productId }) => (
    productIdType === isbnIdentifierTypeId
      ? acc.add(productId)
      : acc
  ), new Set());

  const normalizedIsbnIdentifiers = await (
    Promise
      .all(
        [...isbnIdentifiers].map((isbn) => mutator.convertToIsbn13.GET({ params: { isbn } })),
      )
      .then(converted => converted.map(({ isbn }) => isbn))
  );

  const otherProductIdentifiers = productIdentifiers
    .filter(({ productIdType }) => productIdType !== isbnIdentifierTypeId)
    .map(({ productId }) => productId);

  const productIds = [
    ...otherProductIdentifiers,
    ...normalizedIsbnIdentifiers,
  ];

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
