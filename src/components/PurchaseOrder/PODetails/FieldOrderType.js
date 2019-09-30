import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

export const ORDER_TYPE = {
  oneTime: 'One-Time',
  ongoing: 'Ongoing',
};

const ORDER_TYPE_OPTIONS = Object.keys(ORDER_TYPE).map((key) => ({
  labelId: `ui-orders.order_type.${key}`,
  value: ORDER_TYPE[key],
}));

const FieldOrderType = ({ disabled, required }) => {
  return (
    <FieldSelect
      dataOptions={ORDER_TYPE_OPTIONS}
      label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
      name="orderType"
      required={required}
      disabled={disabled}
    />
  );
};

FieldOrderType.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldOrderType.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldOrderType;
