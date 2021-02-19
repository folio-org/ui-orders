import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

const TotalEncumberedValue = ({ totalEncumbered, label }) => {
  return (
    <KeyValue label={label}>
      <AmountWithCurrencyField amount={totalEncumbered} />
    </KeyValue>
  );
};

TotalEncumberedValue.propTypes = {
  totalEncumbered: PropTypes.number,
  label: PropTypes.node.isRequired,
};

export default TotalEncumberedValue;
