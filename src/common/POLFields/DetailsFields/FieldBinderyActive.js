import PropTypes from 'prop-types';
import {
  Field,
  useForm,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { OPTION_VALUE_WITH_BINDERY_ACTIVE } from '../../../components/POLine/const';

const FIELD_NAMES = {
  isBinderyActive: 'details.isBinderyActive',
  orderFormat: 'physical.createInventory',
  receivingWorkflow: 'checkinItems',
};

export const FieldBinderyActive = ({ disabled = false }) => {
  const { batch, change } = useForm();

  const onChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      batch(() => {
        change(FIELD_NAMES.isBinderyActive, checked);
        change(FIELD_NAMES.orderFormat, OPTION_VALUE_WITH_BINDERY_ACTIVE);
        change(FIELD_NAMES.receivingWorkflow, true);
      });
    } else {
      change('details.bindery', false);
    }
  };

  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.isBinderyActive" />}
      name={FIELD_NAMES.isBinderyActive}
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
