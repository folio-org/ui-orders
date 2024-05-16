import { UNIQUE_NAME_ERROR_CODE } from './constants';

export const handleRoutingListError = async ({ error, showCallout, messageId }) => {
  const errorResponse = await error.response.json();
  const errorCode = errorResponse.errors[0]?.code;
  let errorMessage = messageId;

  if (errorCode === UNIQUE_NAME_ERROR_CODE) {
    errorMessage = 'ui-orders.routing.list.create.error.nameMustBeUnique';
  }

  showCallout({
    messageId: errorMessage,
    type: 'error',
  });
};
