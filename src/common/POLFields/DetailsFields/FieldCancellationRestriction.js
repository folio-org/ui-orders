import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldCancellationRestriction = () => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.cancellationRestriction" />}
      name={POL_FORM_FIELDS.cancellationRestriction}
      type="checkbox"
      vertical
      validateFields={[]}
    />
  );
};

export default FieldCancellationRestriction;
