import PropTypes from 'prop-types';
import {
  Field,
  useForm,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

import { OPTION_VALUE_WITH_BINDERY_ACTIVE } from '../../../components/POLine/const';
import { PO_LINE_FIELD_NAMES } from '../constants';

export const FieldBinderyActive = ({ disabled = false }) => {
  const { batch, change } = useForm();

  const onChange = (e) => {
    const { checked } = e.target;

    if (checked) {
      batch(() => {
        change(PO_LINE_FIELD_NAMES.isBinderyActive, checked);
        change(PO_LINE_FIELD_NAMES.orderFormat, OPTION_VALUE_WITH_BINDERY_ACTIVE);
        change(PO_LINE_FIELD_NAMES.receivingWorkflow, true);
      });
    } else {
      change(PO_LINE_FIELD_NAMES.isBinderyActive, false);
    }
  };

  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.isBinderyActive" />}
      name={PO_LINE_FIELD_NAMES.isBinderyActive}
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
