import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

export const DEFAULT_CURRENCY = 'USD';

const DEFAULT_CURRENCY_OPTIONS = [{ label: DEFAULT_CURRENCY, value: DEFAULT_CURRENCY }];

const FieldCurrency = ({ required, disabled, currencies = [] }) => {
  const currenciesOptions = currencies.length
    ? currencies.map(v => ({ label: v, value: v }))
    : DEFAULT_CURRENCY_OPTIONS;

  return (
    <FieldSelect
      dataOptions={currenciesOptions}
      label={<FormattedMessage id="ui-orders.cost.currency" />}
      name="cost.currency"
      required={required}
      disabled={disabled}
    />
  );
};

FieldCurrency.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldCurrency.defaultProps = {
  currencies: [],
  required: true,
};

FieldCurrency.displayName = 'FieldCurrency';

export default FieldCurrency;
