import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';

import { ERROR_CODES } from '../../../common/constants';

const POL_NUMBER_KEY = 'poLineNumber';

const showMessage = (callout, code, error, path) => {
  const title = get(error, 'errors.0.parameters.0.value', '');

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
  let error;

  try {
    error = await response.clone().json();
  } catch (parsingException) {
    error = response;
  }

  const errorCode = get(error, 'errors.0.code');
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
        get(error, 'errors.0.parameters', [])
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
    case ERROR_CODES.budgetExpenseClassNotFound: {
      const fundCode = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'fundCode')?.value;
      const expenseClassName = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'expenseClassName')?.value;

      callout.sendCallout({
        messageId: `ui-orders.errors.${code}`,
        type: 'error',
        values: { fundCode, expenseClassName },
      });
      break;
    }
    case ERROR_CODES.fundCannotBePaid: {
      const fundCodes = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'finance.funds')?.value;

      callout.sendCallout({ messageId: `ui-orders.errors.${ERROR_CODES[code]}`, type: 'error', values: { fundCodes } });
      break;
    }
    case ERROR_CODES.fundLocationRestrictionViolation: {
      const polNumber = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'poLineNumber')?.value;

      callout.sendCallout({
        messageId: 'ui-orders.errors.openOrder.fundLocationRestrictionViolation',
        type: 'error',
        values: { polNumber },
      });
      break;
    }
    case ERROR_CODES.budgetNotFoundForFiscalYear: {
      const fundCodes = error?.errors?.[0]?.parameters?.find(({ key }) => key === 'fundCodes')?.value;
      const messageOptions = {
        messageId: `ui-orders.errors.${ERROR_CODES[code]}`,
        type: 'error',
        values: { fundCodes },
      };

      try {
        callout.sendCallout({
          ...messageOptions,
          values: { fundCodes: JSON.parse(fundCodes).join(', ') },
        });
      } catch {
        callout.sendCallout(messageOptions);
      }

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
