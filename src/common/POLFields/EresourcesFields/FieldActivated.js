import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldActivated = () => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.eresource.activationStatus" />}
      name={POL_FORM_FIELDS.eresourceActivated}
      type="checkbox"
      vertical
    />
  );
};

export default FieldActivated;
