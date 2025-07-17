import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  InfoPopover,
} from '@folio/stripes/components';

import { PO_FORM_FIELDS } from '../constants';

const label = (
  <>
    <FormattedMessage id="ui-orders.orderDetails.manualPO" />
    <InfoPopover content={<FormattedMessage id="ui-orders.orderDetails.manualPO.info" />} />
  </>
);

const FieldIsManualPO = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={label}
      name={PO_FORM_FIELDS.manualPo}
      type="checkbox"
      disabled={disabled}
      vertical
      validateFields={[]}
    />
  );
};

FieldIsManualPO.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldIsManualPO;
