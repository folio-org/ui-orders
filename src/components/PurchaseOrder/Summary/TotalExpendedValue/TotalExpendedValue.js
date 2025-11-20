import PropTypes from 'prop-types';

import { KeyValue } from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

const TotalExpendedValue = ({
  label,
  totalExpended,
}) => {
  return (
    <KeyValue label={label}>
      <AmountWithCurrencyField amount={totalExpended} />
    </KeyValue>
  );
};

TotalExpendedValue.propTypes = {
  label: PropTypes.node.isRequired,
  totalExpended: PropTypes.number,
};

export default TotalExpendedValue;
