import isBoolean from 'lodash/isBoolean';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { InfoPopover } from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const label = (
  <>
    <FormattedMessage id="ui-orders.poLine.receivingWorkflow" />
    <InfoPopover content={<FormattedMessage id="ui-orders.poLine.receivingWorkflow.infoPopover" />} />
  </>
);

const options = [
  { labelId: 'ui-orders.poLine.receivingWorkflow.synchronized', value: false },
  { labelId: 'ui-orders.poLine.receivingWorkflow.independent', value: true },
];

const validate = (value) => (
  isBoolean(value) ? undefined : <FormattedMessage id="stripes-acq-components.validation.required" />
);

/*
  Relation to the receiving workflow:
  `true` - independent receiving workflow, items are checked in independently of the POL
  `false` - synchronized receiving workflow, items are checked in as part of the POL receiving
*/

const FieldCheckInItems = ({
  disabled = false,
  onChange: onChangeProp,
  required = false,
}) => {
  const { change } = useForm();

  const onChange = useCallback(({ target: { value } }) => {
    const parsedValue = value ? value === 'true' : null;

    return onChangeProp
      ? onChangeProp(parsedValue)
      : change(POL_FORM_FIELDS.checkinItems, parsedValue);
  }, [change, onChangeProp]);

  return (
    <FieldSelectFinal
      dataOptions={options}
      label={label}
      name={POL_FORM_FIELDS.checkinItems}
      disabled={disabled}
      onChange={onChange}
      required={required}
      validate={required ? validate : undefined}
    />
  );
};

FieldCheckInItems.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default FieldCheckInItems;
