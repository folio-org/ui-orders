import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectFinal as FieldSelect } from '@folio/stripes-acq-components';

import {
  ORDER_TYPE,
  PO_FORM_FIELDS,
} from '../../../common/constants';

const ORDER_TYPE_OPTIONS = Object.keys(ORDER_TYPE).map((key) => ({
  labelId: `ui-orders.order_type.${key}`,
  value: ORDER_TYPE[key],
}));

const FieldOrderType = ({
  disabled = false,
  isNonInteractive = false,
  required = true,
  ...props
}) => {
  return (
    <FieldSelect
      dataOptions={ORDER_TYPE_OPTIONS}
      disabled={disabled}
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
      name={PO_FORM_FIELDS.orderType}
      required={required}
      validateFields={[]}
      {...props}
    />
  );
};

FieldOrderType.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  required: PropTypes.bool,
};

export default FieldOrderType;
