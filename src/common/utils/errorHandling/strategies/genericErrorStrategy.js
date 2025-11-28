import { ERROR_CODE_GENERIC } from '@folio/stripes-acq-components';

export const genericErrorStrategy = ({
  callout,
  defaultErrorCode, // Translation for this error code should be always available
  intl,
}) => {
  const handle = (errorsContainer) => {
    const responseErrorCode = errorsContainer.getError().code;

    /*
      In case of generic error code, we use `defaultErrorCode` to show more specific message.
     */
    const errorCode = responseErrorCode === ERROR_CODE_GENERIC
      ? defaultErrorCode
      : responseErrorCode;

    const errorMessage = intl.formatMessage({
      id: `ui-orders.errors.${errorCode}`,
      defaultMessage: intl.formatMessage({ id: `ui-orders.errors.${defaultErrorCode}` }), // Should be used if specific error message is not defined
    });

    callout.sendCallout({
      message: errorMessage,
      type: 'error',
    });
  };

  return { handle };
};
