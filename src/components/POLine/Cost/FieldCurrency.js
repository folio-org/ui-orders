import React from 'react';
import PropTypes from 'prop-types';

import { currenciesOptions } from '@folio/stripes/components';
import { FieldSelection } from '@folio/stripes-acq-components';

const FieldCurrency = ({ required, disabled }) => (
  <FieldSelection
    dataOptions={currenciesOptions}
    disabled={disabled}
    id="cost-currency"
    labelId="ui-orders.cost.currency"
    name="cost.currency"
    required={required}
  />
);

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
