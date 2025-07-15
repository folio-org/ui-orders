import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TooltippedControl } from '@folio/stripes-acq-components';
import { Checkbox } from '@folio/stripes/components';

import { PO_FORM_FIELDS } from '../../constants';

const FieldIsManualRenewal = ({
  disabled = false,
  isNonInteractive = false,
}) => {
  return (
    <Field
      component={TooltippedControl}
      controlComponent={Checkbox}
      label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}
      name={PO_FORM_FIELDS.manualRenewal}
      readOnly={disabled}
      tooltipText={disabled && <FormattedMessage id="ui-orders.renewals.manualRenewal.tooltip" />}
      type="checkbox"
      disabled={!disabled && isNonInteractive}
      vertical
      validateFields={[]}
      fullWidth
    />
  );
};

FieldIsManualRenewal.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

export default FieldIsManualRenewal;
