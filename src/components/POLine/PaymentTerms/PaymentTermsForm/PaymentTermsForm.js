import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  Field,
  useForm,
  useFormState,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FieldSelectionFinal,
  TextField,
  useShowCallout,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FiscalYearsDistribution } from './FiscalYearsDistribution';

export const PaymentTermsForm = ({
  disabled = false,
  isLoading = false,
  isNonInteractive = false,
  isTemplate = false,
  name,
  onStartingFYChange,
  paymentTermsFiscalYears,
  startingFiscalYears,
}) => {
  const showCallout = useShowCallout();

  const { change } = useForm();
  const { values } = useFormState();

  const {
    multiYearPayment,
    paymentTerms: {
      fiscalYearDistributions,
      startingFiscalYearId,
    } = {},
  } = values;

  const isMultiYearPayment = Boolean(multiYearPayment); // If multi-year payment is not selected, disable the form

  const isAddFYButtonHidden = (
    isNonInteractive
    || !isMultiYearPayment
    || !startingFiscalYearId
  );

  const isAddFYButtonDisabled = (
    disabled
    || isLoading // Fiscal years are not being fetched
    || !paymentTermsFiscalYears?.length // There are no available fiscal years to add
    || fiscalYearDistributions?.length >= paymentTermsFiscalYears?.length // All available fiscal years have already been added
  );

  const isRequired = !isTemplate && isMultiYearPayment;

  const startingFiscalYearOptions = useMemo(() => {
    return startingFiscalYears.map(({ code, id: fiscalYearId }) => ({ value: fiscalYearId, label: code }));
  }, [startingFiscalYears]);

  const paymentTermsFiscalYearsMap = useMemo(() => {
    return paymentTermsFiscalYears?.reduce((acc, fy) => acc.set(fy.id, fy), new Map());
  }, [paymentTermsFiscalYears]);

  const onAddFiscalYearDistribution = useCallback((fields) => {
    const nextFiscalYearId = paymentTermsFiscalYears[fields.length]?.id;

    // If there are no more fiscal years available to add, show an error message and return early
    if (!nextFiscalYearId) {
      showCallout({
        messageId: 'ui-orders.poLine.paymentTerms.FYDistributions.validation.noMoreFYs',
        type: 'error',
      });

      return;
    }

    change(`${name}.prepaymentTerm`, fields.length + 1);
    fields.push({
      fiscalYearId: nextFiscalYearId,
      fundDistributions: [],
    });
  }, [change, name, paymentTermsFiscalYears, showCallout]);

  const onRemoveFiscalYearDistribution = useCallback((index, fields) => {
    change(`${name}.prepaymentTerm`, Math.max(fields.length - 1, 0));
    fields.remove(index);
  }, [change, name]);

  return (
    <>
      <Row>
        <Col xs={3}>
          <Field
            component={TextField}
            disabled={disabled || !isMultiYearPayment}
            label={<FormattedMessage id="ui-orders.poLine.paymentTerms.totalPrice" />}
            name={`${name}.totalPrice`}
            required={isRequired}
            validate={isRequired ? validateRequired : undefined}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            disabled
            label={<FormattedMessage id="ui-orders.poLine.paymentTerms.prepaymentTerm" />}
            name={`${name}.prepaymentTerm`}
            required={isRequired}
            validate={isRequired ? validateRequired : undefined}
          />
        </Col>
        <Col xs={3}>
          <FieldSelectionFinal
            dataOptions={startingFiscalYearOptions}
            disabled={disabled || !isMultiYearPayment || isLoading}
            label={<FormattedMessage id="ui-orders.poLine.paymentTerms.startingFY" />}
            name={`${name}.startingFiscalYearId`}
            onChange={onStartingFYChange}
            required={isRequired}
          />
        </Col>
      </Row>
      <Row>
        <Col xs>
          <FiscalYearsDistribution
            isAddFYButtonHidden={isAddFYButtonHidden}
            isAddFYButtonDisabled={isAddFYButtonDisabled}
            isLoading={isLoading}
            isNonInteractive={isNonInteractive}
            name={`${name}.fiscalYearDistributions`}
            onAddFiscalYear={onAddFiscalYearDistribution}
            onRemoveFiscalYear={onRemoveFiscalYearDistribution}
            paymentTermsFiscalYearsMap={paymentTermsFiscalYearsMap}
          />
        </Col>
      </Row>
    </>
  );
};

PaymentTermsForm.propTypes = {
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  isTemplate: PropTypes.bool,
  name: PropTypes.string.isRequired,
  paymentTermsFiscalYears: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  startingFiscalYears: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
};
