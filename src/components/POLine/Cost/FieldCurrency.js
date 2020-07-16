import React from 'react';
import PropTypes from 'prop-types';

import { useCurrencyOptions } from '@folio/stripes/components';
import { FieldSelectionFinal } from '@folio/stripes-acq-components';

const FieldCurrency = ({ required, disabled }) => {
  const currenciesOptions = useCurrencyOptions();

  return (
    <FieldSelectionFinal
      dataOptions={currenciesOptions}
      disabled={disabled}
      id="cost-currency"
      labelId="ui-orders.cost.currency"
      name="cost.currency"
      required={required}
    />
  );
};

FieldCurrency.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldCurrency.defaultProps = {
  required: true,
  disabled: false,
};

FieldCurrency.displayName = 'FieldCurrency';

export default FieldCurrency;
