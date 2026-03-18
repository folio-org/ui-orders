import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';

import { ORDER_TYPE_TRANSLATED_VALUES } from '../../../common/constants';

export const OrderType = ({ orderType }) => {
  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
      value={ORDER_TYPE_TRANSLATED_VALUES[orderType]}
    />
  );
};

OrderType.propTypes = {
  orderType: PropTypes.string,
};
