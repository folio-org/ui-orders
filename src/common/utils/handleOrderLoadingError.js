import get from 'lodash/get';

import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../constants';
import { getCommonErrorMessage } from './getCommonErrorMessage';

const DEFAULT_LOADING_ERROR_CODE = 'orderNotLoaded';

export const handleOrderLoadingError = (sendCallout) => async (error) => {
  const { handler } = await ResponseErrorsContainer.create(error?.response || error);

  const errorCode = get(ERROR_CODES, handler.getError().code, DEFAULT_LOADING_ERROR_CODE);
  const message = getCommonErrorMessage(errorCode);

  sendCallout({
    message,
    type: 'error',
  });
};
