import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { get } from 'lodash';

export const ERROR_CODES = {
  vendorIsInactive: 'vendorIsInactive',
  accessProviderIsInactive: 'accessProviderIsInactive',
  vendorNotFound: 'vendorNotFound',
  orderOpen: 'orderOpen',
  orderClosed: 'orderClosed',
  accessProviderNotFound: 'accessProviderNotFound',
  missingInstanceStatus: 'missingInstanceStatus',
  missingInstanceType: 'missingInstanceType',
  missingLoanType: 'missingLoanType',
  userHasNoPermission: 'userHasNoPermission',
};

const POL_NUMBER_KEY = 'poLineNumber';

const showMessage = (callout, code, error, path) => {
  const title = get(error, 'errors.0.parameters.0.value', '');

  callout.current.sendCallout({
    type: 'error',
    message: (
      <FormattedMessage
        id={`ui-orders.errors.${code}`}
        values={{ value: <Link to={`/settings/inventory/${path}`}>{title}</Link> }}
      />
    ),
    timeout: 0,
  });
};

const showUpdateOrderError = async (response, callout, openModal) => {
  let error;

  try {
    error = await response.json();
  } catch (parsingException) {
    error = response;
  }

  const errorCode = get(error, 'errors.0.code');
  const code = get(ERROR_CODES, errorCode, 'orderGenericError1');

  switch (code) {
    case ERROR_CODES.vendorIsInactive:
    case ERROR_CODES.userHasNoPermission:
    case ERROR_CODES.vendorNotFound: {
      openModal([{ code }]);
      break;
    }
    case ERROR_CODES.accessProviderIsInactive:
    case ERROR_CODES.accessProviderNotFound: {
      let errors =
        get(error, 'errors.0.parameters', [])
          .filter(({ key }) => key === POL_NUMBER_KEY)
          .map(({ value }) => ({ code, poLineNumber: value }));

      errors = errors.length ? errors : [{ code }];
      openModal(errors);
      break;
    }
    case ERROR_CODES.missingInstanceStatus: {
      showMessage(callout, code, error, 'instanceStatusTypes');
      break;
    }
    case ERROR_CODES.missingInstanceType: {
      showMessage(callout, code, error, 'resourcetypes');
      break;
    }
    case ERROR_CODES.missingLoanType: {
      showMessage(callout, code, error, 'loantypes');
      break;
    }
    default: {
      callout.current.sendCallout({
        message: <FormattedMessage id={`ui-orders.errors.${code}`} />,
        type: 'error',
      });
    }
  }
};

export default showUpdateOrderError;
