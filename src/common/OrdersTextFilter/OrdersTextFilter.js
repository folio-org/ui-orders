import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
  TextField,
} from '@folio/stripes/components';

import {
  createClearFilterHandler,
} from '../utils';

const OrdersTextFilter = ({
  id,
  activeFilters = [],
  closedByDefault = true,
  labelId,
  name,
  type,
  onChange,
}) => {
  const clearFilter = createClearFilterHandler(onChange, name);
  const changeFilter = (e) => {
    const value = e.target.value;

    return value
      ? onChange({ name, values: [value] })
      : clearFilter();
  };

  const intl = useIntl();
  const label = intl.formatMessage({ id: labelId });

  return (
    <Accordion
      id={id}
      closedByDefault={closedByDefault}
      displayClearButton={activeFilters.length > 0}
      header={FilterAccordionHeader}
      label={label}
      onClearFilter={clearFilter}
    >
      <TextField
        ariaLabel={label}
        type={type}
        value={activeFilters[0] || ''}
        onChange={changeFilter}
      />
    </Accordion>
  );
};

OrdersTextFilter.propTypes = {
  id: PropTypes.string,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};

OrdersTextFilter.defaultProps = {
  type: 'text',
};

export default OrdersTextFilter;
