import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectFinal as FieldSelect } from '@folio/stripes-acq-components';
import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ORDER_TYPE } from '../../../common/constants';

const ORDER_TYPE_OPTIONS = Object.keys(ORDER_TYPE).map((key) => ({
  labelId: `ui-orders.order_type.${key}`,
  value: ORDER_TYPE[key],
}));

const FieldOrderType = ({ disabled, isNonInteractive, required }) => {
  return isNonInteractive
    ? (
      <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}>
        {isNonInteractive ? <FormattedMessage id={`ui-orders.order_type.${isNonInteractive}`} /> : <NoValue />}
      </KeyValue>
    )
    : (
      <FieldSelect
        dataOptions={ORDER_TYPE_OPTIONS}
        label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
        name="orderType"
        required={required}
        disabled={disabled}
        validateFields={[]}
      />
    );
};

FieldOrderType.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.node,
  required: PropTypes.bool,
};

FieldOrderType.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldOrderType;
