import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../constants';

const FieldOngoingInfoNotes = ({
  disabled = false,
  isNonInteractive = false,
  ...props
}) => {
  return (
    <Field
      component={TextArea}
      disabled={disabled}
      fullWidth
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.renewals.notes" />}
      name={PO_FORM_FIELDS.ongoingNotes}
      validateFields={[]}
      {...props}
    />
  );
};

FieldOngoingInfoNotes.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

export default FieldOngoingInfoNotes;
