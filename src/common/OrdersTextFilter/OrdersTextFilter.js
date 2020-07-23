import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  TextField,
} from '@folio/stripes/components';

import {
  FilterAccordion,
} from '@folio/stripes-acq-components';

const OrdersTextFilter = ({
  id,
  activeFilters,
  closedByDefault,
  disabled,
  labelId,
  name,
  type,
  onChange,
}) => {
  const changeFilter = useCallback((e) => {
    const value = e.target.value;

    return value
      ? onChange({ name, values: [value] })
      : onChange({ name, values: [] });
  }, [name, onChange]);

  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      label={label}
      name={name}
      onChange={onChange}
    >
      <TextField
        ariaLabel={label}
        type={type}
        value={activeFilters?.[0] || ''}
        onChange={changeFilter}
      />
    </FilterAccordion>
  );
};

OrdersTextFilter.propTypes = {
  id: PropTypes.string,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

OrdersTextFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
  type: 'text',
};

export default OrdersTextFilter;
