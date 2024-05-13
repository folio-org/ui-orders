import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-final-form';
import { isBoolean } from 'lodash';

import { InfoPopover } from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

const options = [
  { labelId: 'ui-orders.poLine.receivingWorkflow.synchronized', value: false },
  { labelId: 'ui-orders.poLine.receivingWorkflow.independent', value: true },
];

const FieldCheckInItems = ({ disabled, isBindaryActive, required }) => {
  const { change } = useForm();
  const label = (
    <>
      <FormattedMessage id="ui-orders.poLine.receivingWorkflow" />
      <InfoPopover content={<FormattedMessage id="ui-orders.poLine.receivingWorkflow.info" />} />
    </>
  );

  const onChange = ({ target: { value } }) => {
    const parsedValue = value ? value === 'true' : null;

    change('checkinItems', parsedValue);
  };

  const validate = (value) => (
    isBoolean(value) ? undefined : <FormattedMessage id="stripes-acq-components.validation.required" />
  );

  useEffect(() => {
    if (isBindaryActive) {
      change('checkinItems', true);
    }
  }, [change, isBindaryActive]);

  return (
    <FieldSelectFinal
      dataOptions={options}
      label={label}
      name="checkinItems"
      disabled={disabled || isBindaryActive}
      onChange={onChange}
      required={required}
      validate={required ? validate : undefined}
    />
  );
};

FieldCheckInItems.propTypes = {
  disabled: PropTypes.bool,
  isBindaryActive: PropTypes.bool,
  required: PropTypes.bool,
};

FieldCheckInItems.defaultProps = {
  disabled: false,
  isBindaryActive: false,
  required: false,
};

export default FieldCheckInItems;
