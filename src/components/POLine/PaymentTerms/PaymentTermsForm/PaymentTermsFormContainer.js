import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import { useForm } from 'react-final-form';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import { isWorkflowStatusNotPending } from '../../../PurchaseOrder/util';
import {
  usePaymentTermsFiscalYears,
  useStartingFiscalYearChangeHandler,
  useStartingFiscalYears,
} from '../hooks';
import { PaymentTermsForm } from './PaymentTermsForm';

export const PaymentTermsFormContainer = ({
  order,
  isTemplate,
}) => {
  const [paymentTermsFiscalYears, setPaymentTermsFiscalYears] = useState([]);

  const { getFieldState } = useForm();

  const isPostPendingOrder = order && isWorkflowStatusNotPending(order);
  const {
    initial: initialStartingFiscalYearValue,
    pristine: isStartingFiscalYearPristine,
  } = getFieldState(`${POL_FORM_FIELDS.paymentTerms}.startingFiscalYearId`) || {};

  const {
    fiscalYears: startingFiscalYears,
    isFetching: isStartingFiscalYearsFetching,
  } = useStartingFiscalYears(initialStartingFiscalYearValue);

  // Used to fetch initial list of FYs for mapping
  const { isFetching: isPaymentTermsFiscalYearsFetching } = usePaymentTermsFiscalYears(
    initialStartingFiscalYearValue,
    {
      enabled: isStartingFiscalYearPristine,
      onSuccess: (data) => setPaymentTermsFiscalYears(data.fiscalYears),
    },
  );

  const {
    handleChange: handleStartingFiscalYearChange,
    isLoading: isStartingFiscalYearChangeLoading,
  } = useStartingFiscalYearChangeHandler();

  const isLoadingState = (
    isStartingFiscalYearsFetching
    || isPaymentTermsFiscalYearsFetching
    || isStartingFiscalYearChangeLoading
  );

  const onStartingFYChange = useCallback(async (value) => {
    await handleStartingFiscalYearChange(value)
      .then(({ fiscalYears }) => setPaymentTermsFiscalYears(fiscalYears))
      .catch((e) => {
        console.log('Error fetching fiscal years for payment terms', e);
      });
  }, [handleStartingFiscalYearChange]);

  return (
    <PaymentTermsForm
      disabled={isPostPendingOrder}
      isLoading={isLoadingState}
      isNonInteractive={isPostPendingOrder}
      isTemplate={isTemplate}
      name={POL_FORM_FIELDS.paymentTerms}
      onStartingFYChange={onStartingFYChange}
      paymentTermsFiscalYears={paymentTermsFiscalYears} // A list of FYs for mapping
      startingFiscalYears={startingFiscalYears} // A list of FYs for dropdown
    />
  );
};

PaymentTermsFormContainer.propTypes = {
  order: PropTypes.shape({
    workflowStatus: PropTypes.string.isRequired,
  }),
};
