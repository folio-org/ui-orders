import {
  Field,
  useForm,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes-acq-components';
import {
  IconButton,
  InfoPopover,
} from '@folio/stripes/components';

import { POL_FORM_FIELDS } from '../../constants';

const FIELD_NAME = POL_FORM_FIELDS.donor_DEPRECATED;

const FieldDonor = () => {
  const { change, getFieldState } = useForm();
  const value = getFieldState(FIELD_NAME)?.value;

  const label = (
    <>
      <FormattedMessage id="ui-orders.poLine.donor" />
      <InfoPopover content={<FormattedMessage id="ui-orders.poLine.donor.info" />} />
    </>
  );

  const onClick = () => {
    change(FIELD_NAME, '');
  };

  const clearIcon = (
    <IconButton
      onClick={onClick}
      icon="times-circle-solid"
      size="small"
    />
  );

  return (
    <Field
      component={TextField}
      fullWidth
      id={FIELD_NAME}
      label={label}
      name={FIELD_NAME}
      type="text"
      validateFields={[]}
      disabled
      endControl={value && clearIcon}
    />
  );
};

export default FieldDonor;
