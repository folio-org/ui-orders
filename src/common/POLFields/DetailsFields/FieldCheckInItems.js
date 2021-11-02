import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-final-form';

import { InfoPopover } from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

const options = [
  { labelId: 'ui-orders.poLine.receivingWorkflow.synchronized', value: false },
  { labelId: 'ui-orders.poLine.receivingWorkflow.independent', value: true },
];

const FieldCheckInItems = ({ disabled, required }) => {
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

  return (
    <FieldSelectFinal
      dataOptions={options}
      label={label}
      name="checkinItems"
      disabled={disabled}
      onChange={onChange}
      required={required}
    />
  );
};

FieldCheckInItems.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldCheckInItems.defaultProps = {
  disabled: false,
  required: false,
};

export default FieldCheckInItems;
