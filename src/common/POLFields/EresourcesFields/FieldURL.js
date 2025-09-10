import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
  validateURL,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldURL = props => (
  <Field
    component={TextField}
    label={<FormattedMessage id="ui-orders.eresource.url" />}
    name={POL_FORM_FIELDS.eresourceResourceUrl}
    type="text"
    validate={validateURL}
    {...props}
  />
);

export default FieldURL;
