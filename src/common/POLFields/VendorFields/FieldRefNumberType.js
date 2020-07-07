import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectFinal } from '@folio/stripes-acq-components';

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

const parseRefNumberValue = (value) => (value === '' ? null : value);

const FieldRefNumberType = ({ required }) => {
  return (
    <FieldSelectFinal
      dataOptions={REF_NUMBER_TYPE_OPTIONS}
      fullWidth
      label={<FormattedMessage id="ui-orders.vendor.refNumberType" />}
      name="vendorDetail.refNumberType"
      required={required}
      parse={parseRefNumberValue}
      validate={required ? requiredRefNumber : undefined}
    />
  );
};

FieldRefNumberType.propTypes = {
  required: PropTypes.bool,
};

FieldRefNumberType.defaultProps = {
  required: true,
};

FieldRefNumberType.displayName = 'FieldRefNumberType';

export default FieldRefNumberType;
