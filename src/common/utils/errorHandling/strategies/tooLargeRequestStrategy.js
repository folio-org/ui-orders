import { ERROR_CODES } from '../../../constants';

export const tooLargeRequestStrategy = ({ callout }) => {
  const handle = () => {
    callout.sendCallout({
      messageId: `ui-orders.errors.${ERROR_CODES.tooLargeRequest}`,
      type: 'error',
    });
  };

  return { handle };
};
