import get from 'lodash/get';
import {
  useCallback,
  useRef,
} from 'react';
import { useForm } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ResponseErrorsContainer,
  usePrevious,
} from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  PO_FORM_FIELDS,
} from '../../../../common/constants';
import { getCommonErrorMessage } from '../../../../common/utils';
import { ORDER_NUMBER_VALIDATE_API } from '../../../Utils/api';
import { getFullOrderNumber } from '../../../Utils/orderResource';

export const usePONumberFieldValidator = () => {
  const ky = useOkapiKy();
  const abortControllerRef = useRef(null);

  const {
    getState,
    getFieldState,
  } = useForm();

  const currentFullOrderNumber = usePrevious(getFullOrderNumber(getState().values));

  const callAPI = useCallback((values, { signal }) => {
    const newFullOrderNumber = getFullOrderNumber(values);

    return (values.poNumber && currentFullOrderNumber) !== newFullOrderNumber
      ? ky.post(
        ORDER_NUMBER_VALIDATE_API,
        {
          json: { poNumber: newFullOrderNumber },
          signal,
        },
      )
        .then(() => {
          abortControllerRef.current = null;
        })
        .catch((e) => parsePONumberValidationError(e))
      : Promise.resolve();
  }, [currentFullOrderNumber, ky]);

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: ({ poNumber, values }) => {
      const isDirty = getFieldState(PO_FORM_FIELDS.poNumber)?.dirty;

      // Cancel previous API requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      return poNumber && isDirty
        ? callAPI(values, { signal: abortControllerRef.current.signal })
        : Promise.resolve();
    },
  });

  // Adapter for form field validate interface
  const validate = (poNumber, values) => mutateAsync({ poNumber, values });

  return {
    validate,
    isLoading,
  };
};

const DEFAULT_ERROR_CODE = 'orderNumberIsNotValid';
const PATTERN_MISMATCH_ERROR_CODE = 'jakarta.validation.constraints.Pattern.message';
const PO_NUMBER_LENGTH_LIMIT = 22;

async function parsePONumberValidationError({ response }) {
  const { handler } = await ResponseErrorsContainer.create(response);
  const errorCode = handler.getError().code;

  if (errorCode === PATTERN_MISMATCH_ERROR_CODE) {
    return (
      <FormattedMessage
        id="ui-orders.errors.poNumberPatternMismatch"
        values={{ count: PO_NUMBER_LENGTH_LIMIT }}
      />
    );
  }

  const errorCodeTranslationKey = get(ERROR_CODES, errorCode, DEFAULT_ERROR_CODE);

  return getCommonErrorMessage(errorCodeTranslationKey);
}
