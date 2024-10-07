import get from 'lodash/get';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../../common/constants';
import {
  noBudgetForFiscalYearStrategy,
  noExpenseClassesStrategy,
  restrictedLocationViolationStrategy,
} from './handleErrorsStrategies';

const POL_NUMBER_KEY = 'poLineNumber';

const showMessage = (callout, code, errors, path) => {
  const title = get(errors.getError().parameters, '0.value', '');

  callout.sendCallout({
    type: 'error',
    message: (
      <FormattedMessage
        id={`ui-orders.errors.${code}`}
        values={{ value: <a href={`/settings/inventory/${path}`}>{title}</a> }}
      />
    ),
    timeout: 0,
  });
};

const showUpdateOrderError = async (
  response,
  callout,
  openModal,
  genericCode = ERROR_CODES.orderGenericError1,
  toggleDeletePieces = null,
) => {
  const { handler } = await ResponseErrorsContainer.create(response);

  const errorCode = handler.getError().code;
  const code = get(ERROR_CODES, errorCode, genericCode);

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
        handler.getError().parameters
          .filter(({ key }) => key === POL_NUMBER_KEY)
          .map(({ value }) => ({ code, poLineNumber: value }));

      errors = errors.length ? errors : [{ code }];
      openModal(errors);
      break;
    }
    case ERROR_CODES.piecesNeedToBeDeleted: {
      if (toggleDeletePieces) toggleDeletePieces();
      break;
    }
    case ERROR_CODES.missingInstanceStatus: {
      showMessage(callout, code, handler, 'instanceStatusTypes');
      break;
    }
    case ERROR_CODES.missingInstanceType: {
      showMessage(callout, code, handler, 'resourcetypes');
      break;
    }
    case ERROR_CODES.missingLoanType: {
      showMessage(callout, code, handler, 'loantypes');
      break;
    }
    case ERROR_CODES.budgetExpenseClassNotFound: {
      handler.handle(noExpenseClassesStrategy({ callout }));
      break;
    }
    case ERROR_CODES.fundCannotBePaid: {
      const fundCodes = handler.getError().getParameter('finance.funds');

      callout.sendCallout({ messageId: `ui-orders.errors.${ERROR_CODES[code]}`, type: 'error', values: { fundCodes } });
      break;
    }
    case ERROR_CODES.fundLocationRestrictionViolation: {
      handler.handle(restrictedLocationViolationStrategy({ callout }));
      break;
    }
    case ERROR_CODES.budgetNotFoundForFiscalYear: {
      handler.handle(noBudgetForFiscalYearStrategy({ callout }));
      break;
    }
    default: {
      callout.sendCallout({
        message: <FormattedMessage id={`ui-orders.errors.${code}`} />,
        type: 'error',
      });
    }
  }
};

export default showUpdateOrderError;
