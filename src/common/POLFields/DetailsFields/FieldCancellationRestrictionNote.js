import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldCancellationRestrictionNote = () => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.cancellationRestrictionNote" />}
      name={POL_FORM_FIELDS.cancellationRestrictionNote}
      validateFields={[]}
    />
  );
};

export default FieldCancellationRestrictionNote;
