import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FieldCollection = ({ disabled = false }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      id="collection"
      label={<FormattedMessage id="ui-orders.poLine.сollection" />}
      name={POL_FORM_FIELDS.collection}
      type="checkbox"
      disabled={disabled}
      vertical
    />
  );
};

FieldCollection.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldCollection;
