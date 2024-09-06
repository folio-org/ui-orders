import { useCallback, useMemo } from 'react';

import {
  EXPENSE_CLASSES_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { showUpdateOrderError } from '../../../components/Utils/order';
import {
  INVALID_TOKEN_MESSAGE,
  MISSING_AFFILIATION_ERROR_CODE,
} from '../../constants';

const useHandleOrderUpdateError = (mutatorExpenseClass) => {
  const mutator = useMemo(() => mutatorExpenseClass, [mutatorExpenseClass]);
  const sendCallout = useShowCallout();

  // this is required to avoid huge refactoring of processing error messages for now
  const context = useMemo(() => ({ sendCallout }), [sendCallout]);

  const handleErrorResponse = useCallback(async (response, orderErrorModalShow, defaultCode, toggleDeletePieces) => {
    try {
      const { errors } = await response.clone().json();
      const errorCode = errors?.[0]?.code;
      const errorMessage = errors?.[0]?.message;

      if (errorCode === 'inactiveExpenseClass') {
        const expenseClassId = errors?.[0]?.parameters?.find(({ key }) => key === 'expenseClassId')?.value;

        if (expenseClassId) {
          const { name } = await mutator.GET({ path: `${EXPENSE_CLASSES_API}/${expenseClassId}` });
          const values = { expenseClass: name };

          sendCallout({
            messageId: 'ui-orders.errors.openOrder.inactiveExpenseClass',
            type: 'error',
            values,
          });
        }
      } else if (errorMessage?.includes(INVALID_TOKEN_MESSAGE)) {
        sendCallout({
          messageId: `ui-orders.errors.${MISSING_AFFILIATION_ERROR_CODE}`,
          type: 'error',
        });
      } else {
        await showUpdateOrderError(response, context, orderErrorModalShow, defaultCode, toggleDeletePieces);
      }
    } catch (e) {
      await showUpdateOrderError(response, context);
    }
    throw new Error('Order update error');
  }, [context, mutator, sendCallout]);

  return [handleErrorResponse];
};

export default useHandleOrderUpdateError;
