import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes/components';

import { PO_FORM_FIELDS } from '../../../../common/constants';

export const FieldNotesOnClosure = ({
  name = PO_FORM_FIELDS.closeReasonNote,
  ...props
}) => {
  return (
    <Field
      component={TextArea}
      label={<FormattedMessage id="ui-orders.orderSummary.closingNote" />}
      name={name}
      {...props}
    />
  );
};

FieldNotesOnClosure.propTypes = {
  name: PropTypes.string,
};
