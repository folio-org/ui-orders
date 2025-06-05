import PropTypes from 'prop-types';
import {
  Field,
  useForm,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { OPTION_VALUE_WITH_BINDERY_ACTIVE } from '../../../components/POLine/const';
import { POL_FORM_FIELDS } from '../../constants';

export const FieldBinderyActive = ({ disabled = false }) => {
  const { batch, change } = useForm();

  const onChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      batch(() => {
        change(POL_FORM_FIELDS.isBinderyActive, checked);
        change(POL_FORM_FIELDS.physicalCreateInventory, OPTION_VALUE_WITH_BINDERY_ACTIVE);
        change(POL_FORM_FIELDS.checkinItems, true);
      });
    } else {
      change(POL_FORM_FIELDS.isBinderyActive, false);
    }
  };

  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.isBinderyActive" />}
      name={POL_FORM_FIELDS.isBinderyActive}
      type="checkbox"
      disabled={disabled}
      onChange={onChange}
      vertical
    />
  );
};

FieldBinderyActive.propTypes = {
  disabled: PropTypes.bool,
};
