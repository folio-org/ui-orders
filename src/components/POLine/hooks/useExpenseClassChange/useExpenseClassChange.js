import get from 'lodash/get';
import {
  useCallback,
  useState,
} from 'react';
import { useForm } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import {
  CQLBuilder,
  fetchInvoiceLines,
  fetchTransactionById,
} from '@folio/stripes-acq-components';

const getAffectedInvoiceLines = (httpClient) => async (encumbranceId, orderLineId) => {
  const cqlBuilder = new CQLBuilder();

  const encumbrance = await fetchTransactionById(httpClient)(encumbranceId);
  const { invoiceLines } = await fetchInvoiceLines(httpClient)({
    searchParams: {
      query: (
        cqlBuilder
          .equal('poLineId', orderLineId)
          .equal('releaseEncumbrance', true)
          .equal('invoices.fiscalYearId', encumbrance.fiscalYearId)
          .build()
      ),
    },
  });

  return invoiceLines;
};

export const useExpenseClassChange = (orderLineId) => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const form = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const onConfirmExpenseClassChange = useCallback(() => setIsConfirmModalOpen(false), []);

  const onExpenseClassChange = useCallback(async ({
    fieldName,
    parentFieldName,
    value,
  }) => {
    const expenseClassFieldState = form.getFieldState(fieldName);
    const encumbranceId = get(form.getState().initialValues, `${parentFieldName}.encumbrance`);

    form.change(fieldName, value);

    if (
      orderLineId
      && expenseClassFieldState.pristine
      && encumbranceId
      && expenseClassFieldState.initial !== value
    ) {
      setIsLoading(true);

      await getAffectedInvoiceLines(ky)(encumbranceId, orderLineId)
        .then((invoiceLines) => setIsConfirmModalOpen(invoiceLines?.length > 0))
        .finally(() => setIsLoading(false));
    }
  }, [form, ky, orderLineId]);

  const renderModal = useCallback(() => (
    <Modal
      open={isConfirmModalOpen}
      label={intl.formatMessage({ id: 'ui-orders.poLine.fundDistribution.expenseClass.modal.title' })}
      size="small"
      footer={(
        <ModalFooter>
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={onConfirmExpenseClassChange}
          >
            <FormattedMessage id="stripes-core.button.confirm" />
          </Button>
        </ModalFooter>
      )}
    >
      <FormattedMessage id="ui-orders.poLine.fundDistribution.expenseClass.modal.description" />
    </Modal>
  ), [intl, isConfirmModalOpen, onConfirmExpenseClassChange]);

  return {
    isLoading,
    onExpenseClassChange,
    renderModal,
  };
};
