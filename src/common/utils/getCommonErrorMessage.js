import { FormattedMessage } from 'react-intl';

export const getCommonErrorMessage = (errorCode, defaultMessage) => {
  const messageId = `ui-orders.errors.${errorCode}`;

  return (
    <FormattedMessage
      id={messageId}
      defaultMessage={defaultMessage}
    />
  );
};
