import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes/components';
import { Required } from '../../Utils/Validate';
import {
  ERESOURCE,
  PHYSICAL,
  PE_MIX,
  OTHER,
} from '../const';

const ORDER_FORMAT = {
  electronicResource: ERESOURCE,
  physicalResource: PHYSICAL,
  PEMix: PE_MIX,
  other: OTHER,
};

const FieldOrderFormat = () => (
  <Field
    component={Select}
    label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
    name="order_format"
    validate={[Required]}
  >
    <FormattedMessage id="ui-orders.dropdown.select">
      {(message) => <option value="">{message}</option>}
    </FormattedMessage>
    {Object.keys(ORDER_FORMAT).map((key) => (
      <FormattedMessage
        id={`ui-orders.order_format.${key}`}
        key={key}
      >
        {(message) => <option value={ORDER_FORMAT[key]}>{message}</option>}
      </FormattedMessage>
    ))}
  </Field>
);

FieldOrderFormat.displayName = 'FieldOrderFormat';

export default FieldOrderFormat;
