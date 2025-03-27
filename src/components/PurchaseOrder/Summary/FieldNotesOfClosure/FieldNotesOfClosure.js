import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { TextArea } from '@folio/stripes/components';

export const FieldNotesOfClosure = ({
  name = 'closeReason.note',
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

FieldNotesOfClosure.propTypes = {
  name: PropTypes.string,
};
