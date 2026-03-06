import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

function PONumber({ value }) {
  return (
    <KeyValue
      data-test-po-number
      label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
      value={value}
    />
  );
}

PONumber.propTypes = {
  value: PropTypes.string,
};

export default PONumber;
