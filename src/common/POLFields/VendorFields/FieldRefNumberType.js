import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { Select } from '@folio/stripes/components';
import { requiredRefNumber } from '../../../components/Utils/Validate';

const REF_NUMBER_TYPE = {
  agentsUnique: "Agent's unique subscription reference number",
  internalNumber: 'Internal vendor number',
  librarysContinuation: "Library's continuation order number",
  suppliersContinuation: "Supplier's continuation order",
  suppliersUnique: "Supplier's unique order line reference number",
};

const FieldRefNumberType = () => (
  <Field
    component={Select}
    fullWidth
    label={<FormattedMessage id="ui-orders.vendor.refNumberType" />}
    name="vendorDetail.refNumberType"
    validate={[requiredRefNumber]}
  >
    <FormattedMessage id="ui-orders.dropdown.select">
      {(message) => <option value="">{message}</option>}
    </FormattedMessage>
    {Object.keys(REF_NUMBER_TYPE).map((key) => (
      <FormattedMessage
        id={`ui-orders.vendor.refNumberType.${key}`}
        key={key}
      >
        {(message) => <option value={REF_NUMBER_TYPE[key]}>{message}</option>}
      </FormattedMessage>
    ))}
  </Field>
);

FieldRefNumberType.displayName = 'FieldRefNumberType';

export default FieldRefNumberType;
