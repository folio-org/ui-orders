import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

const TotalExpendedValue = ({ totalExpended, label }) => {
  return (
    <KeyValue label={label}>
      <AmountWithCurrencyField amount={totalExpended} />
    </KeyValue>
  );
};

TotalExpendedValue.propTypes = {
  totalExpended: PropTypes.number,
  label: PropTypes.node.isRequired,
};

TotalExpendedValue.defaultProps = {
};

export default TotalExpendedValue;
