import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  get,
  isEmpty,
  set,
} from 'lodash';

import { PRODUCT_ID_TYPE } from '../../common/constants';

const FIELD_PRODUCT_ID = 'productId';
const FIELD_PRODUCT_ID_TYPE = 'productIdType';

function asyncValidate(values, dispatch, props, blurredField) {
  const { parentMutator: { validateISBN }, parentResources: { identifierTypes } } = props;
  const isbnType = get(identifierTypes, 'records', []).find(({ name }) => name === PRODUCT_ID_TYPE.isbn);
  const isbnTypeUUID = get(isbnType, 'id');
  const productIds = get(values, 'details.productIds', []);
  const hasISBNProductIds = productIds.some(({ productIdType }) => productIdType === isbnTypeUUID);

  if (blurredField) {
    const blurredFieldArray = blurredField.split('.');
    let productIdTypeUUID = null;
    let productIdPath = null;

    if (blurredFieldArray[blurredFieldArray.length - 1] === FIELD_PRODUCT_ID_TYPE) {
      blurredFieldArray[blurredFieldArray.length - 1] = FIELD_PRODUCT_ID;
      productIdTypeUUID = get(values, blurredField);
      productIdPath = blurredFieldArray.join('.');
    } else {
      blurredFieldArray[blurredFieldArray.length - 1] = FIELD_PRODUCT_ID_TYPE;
      productIdTypeUUID = get(values, blurredFieldArray.join('.'));
      productIdPath = blurredField;
    }
    const isbn = get(values, productIdPath);

    if (isbnTypeUUID && productIdTypeUUID === isbnTypeUUID) {
      return validateISBN.GET({ params: { isbn } }).then(({ isValid }) => {
        if (!isValid) {
          const errors = {};

          set(errors, productIdPath, <FormattedMessage id="ui-orders.errors.invalidISBN" />);
          throw errors;
        }
      });
    }
  } else if (hasISBNProductIds) {
    const validationCalls = productIds
      .map(({ productId: isbn, productIdType }) => {
        return productIdType === isbnTypeUUID
          ? validateISBN.GET({ params: { isbn } })
          : Promise.resolve({ isValid: true });
      });

    return Promise.all(validationCalls)
      .then((responses) => {
        const errors = responses.reduce((accumulator, { isValid }, index) => {
          if (!isValid) set(accumulator, `details.productIds[${index}].productId`, <FormattedMessage id="ui-orders.errors.invalidISBN" />);

          return accumulator;
        }, {});

        if (!isEmpty(errors)) throw errors;
      });
  }

  return Promise.resolve();
}

export default asyncValidate;
