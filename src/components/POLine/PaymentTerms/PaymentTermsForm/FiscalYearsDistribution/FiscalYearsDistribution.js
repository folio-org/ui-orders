import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';

import { Loading } from '@folio/stripes/components';
import { RepeatableFieldWithValidation } from '@folio/stripes-acq-components';

import { FiscalYearsDistributionTerm } from './FiscalYearsDistributionTerm';

export const FiscalYearsDistribution = ({
  isAddFYButtonDisabled,
  isAddFYButtonHidden,
  isLoading,
  isNonInteractive,
  name,
  onAddFiscalYear,
  onRemoveFiscalYear,
  paymentTermsFiscalYearsMap,
}) => {
  const intl = useIntl();

  const renderField = useCallback((fieldName, index, fields) => {
    const onRemove = () => {
      onRemoveFiscalYear(index, fields);
    };
    const showRemoveButton = (fields.length - 1 === index);
    const label = intl.formatMessage(
      { id: 'ui-orders.poLine.paymentTerms.FYDistributions.card.label' },
      {
        code: paymentTermsFiscalYearsMap.get(fields.value[index].fiscalYearId)?.code || intl.formatMessage({ id: 'stripes-acq-components.invalidReference' }),
        sequenceNumber: index + 1,
      },
    );

    return (
      <FiscalYearsDistributionTerm
        onRemove={onRemove}
        showRemoveButton={showRemoveButton}
        label={label}
      />
    );
  }, [intl, onRemoveFiscalYear, paymentTermsFiscalYearsMap]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FieldArray
      addLabel={isAddFYButtonHidden ? null : <FormattedMessage id="ui-orders.poLine.paymentTerms.FYDistributions.action.add" />}
      component={RepeatableFieldWithValidation}
      id={name}
      isNonInteractive={isNonInteractive}
      legend={"TODO: Add legend for fiscal year distributions"}
      name={name}
      onAdd={onAddFiscalYear}
      onRemove={false} // Custom remove button is rendered in the FiscalYearsDistributionTerm component
      canAdd={!isAddFYButtonDisabled}
      renderField={renderField}
    // validate={debouncedValidate}
    />
  );
};

FiscalYearsDistribution.propTypes = {
  isAddFYButtonDisabled: PropTypes.bool,
  isAddFYButtonHidden: PropTypes.bool,
  isLoading: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onAddFiscalYear: PropTypes.func.isRequired,
  onRemoveFiscalYear: PropTypes.func.isRequired,
  paymentTermsFiscalYearsMap: PropTypes.instanceOf(Map),
};
