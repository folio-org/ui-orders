import { useCallback, useMemo } from 'react';

import {
  EXPENSE_CLASSES_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { showUpdateOrderError } from '../../../components/Utils/order';
import { ERROR_CODES } from '../../constants';

const useHandleOrderUpdateError = (mutatorExpenseClass) => {
  const mutator = useMemo(() => mutatorExpenseClass, [mutatorExpenseClass]);
  const sendCallout = useShowCallout();

  // this is required to avoid huge refactoring of processing error messages for now
  const context = useMemo(() => ({ sendCallout }), [sendCallout]);

  const handleErrorResponse = useCallback(async (response, orderErrorModalShow, defaultCode, toggleDeletePieces) => {
    try {
      const { errors } = await response.clone().json();
      const errorCode = errors?.[0]?.code;

      if (errorCode === ERROR_CODES.inactiveExpenseClass) {
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
      } else if (errorCode === ERROR_CODES.fundLocationRestrictionViolation) {
        const fundCode = errors?.[0]?.parameters?.find(({ key }) => key === 'fundCode')?.value;
        const locationCode = errors?.[0]?.parameters?.find(({ key }) => key === 'restrictedLocations')?.value;

        const values = { fundCode, locationCode };

        sendCallout({
          messageId: 'ui-orders.errors.openOrder.fundLocationRestrictionViolation',
          type: 'error',
          values,
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
