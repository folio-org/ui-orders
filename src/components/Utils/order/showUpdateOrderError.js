import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

export const ERROR_CODES = {
  vendorIsInactive: 'vendorIsInactive',
  accessProviderIsInactive: 'accessProviderIsInactive',
  vendorNotFound: 'vendorNotFound',
  orderOpen: 'orderOpen',
  orderClosed: 'orderClosed',
  accessProviderNotFound: 'accessProviderNotFound',
};

const showUpdateOrderError = async (response, callout, openModal) => {
  let error;

  try {
    error = await response.json();
  } catch (parsingException) {
    error = response;
  }

  const errorCode = get(error, 'errors.0.code');
  const messageCode = get(ERROR_CODES, errorCode, 'orderGenericError1');

  if (messageCode !== ERROR_CODES.vendorIsInactive && messageCode !== ERROR_CODES.vendorNotFound) {
    callout.sendCallout({
      message: <FormattedMessage id={`ui-orders.errors.${messageCode}`} />,
      type: 'error',
    });
  } else {
    openModal(messageCode);
  }
};

export default showUpdateOrderError;
