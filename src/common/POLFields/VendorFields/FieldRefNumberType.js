import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { FieldSelect } from '@folio/stripes-acq-components';

import { requiredRefNumber } from '../../../components/Utils/Validate';

const REF_NUMBER_TYPE = {
  agentsUnique: "Agent's unique subscription reference number",
  internalNumber: 'Internal vendor number',
  librarysContinuation: "Library's continuation order number",
  suppliersContinuation: "Supplier's continuation order",
  suppliersUnique: "Supplier's unique order line reference number",
};

const REF_NUMBER_TYPE_OPTIONS = Object.keys(REF_NUMBER_TYPE).map((key) => ({
  labelId: `ui-orders.vendor.refNumberType.${key}`,
  value: REF_NUMBER_TYPE[key],
}));

const FieldRefNumberType = () => (
  <FieldSelect
    dataOptions={REF_NUMBER_TYPE_OPTIONS}
    fullWidth
    label={<FormattedMessage id="ui-orders.vendor.refNumberType" />}
    name="vendorDetail.refNumberType"
    validate={[requiredRefNumber]}
  />
);

FieldRefNumberType.displayName = 'FieldRefNumberType';

export default FieldRefNumberType;
