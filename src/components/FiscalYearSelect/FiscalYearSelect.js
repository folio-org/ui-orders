import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Select } from '@folio/stripes/components';

export const FiscalYearSelect = ({
  dataOptions,
  onSelect,
  value,
}) => {
  return (
    <Select
      label={<FormattedMessage id="ui-orders.order.fiscalYear" />}
      value={value}
      onChange={(e) => onSelect(e.target.value)}
    >
      {dataOptions}
    </Select>
  );
};

FiscalYearSelect.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.node),
  onSelect: PropTypes.func,
  value: PropTypes.string,
};
