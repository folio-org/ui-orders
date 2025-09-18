import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextArea } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldPOLineDescription = () => {
  return (
    <Field
      component={TextArea}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.poLineDescription" />}
      name={POL_FORM_FIELDS.poLineDescription}
      validateFields={[]}
    />
  );
};

export default FieldPOLineDescription;
