import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { currenciesOptions } from '@folio/stripes/components';
import { FieldSelect } from '@folio/stripes-acq-components';

const FieldCurrency = ({ required, disabled }) => (
  <FieldSelect
    dataOptions={currenciesOptions}
    label={<FormattedMessage id="ui-orders.cost.currency" />}
    name="cost.currency"
    required={required}
    disabled={disabled}
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
