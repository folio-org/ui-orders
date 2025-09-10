import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

export const FieldClaimingActive = ({ onChange }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.claimingActive" />}
      onChange={onChange}
      name={POL_FORM_FIELDS.claimingActive}
      type="checkbox"
      vertical
      validateFields={[POL_FORM_FIELDS.claimingInterval]}
    />
  );
};

FieldClaimingActive.propTypes = {
  onChange: PropTypes.func,
};
