import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Select } from '@folio/stripes/components';
import { Required } from '../../../components/Utils/Validate';

export const ACQUISITION_METHOD = {
  approvalPlan: 'Approval Plan',
  dda: 'Demand Driven Acquisitions (DDA)',
  depository: 'Depository',
  eba: 'Evidence Based Acquisitions (EBA)',
  exchange: 'Exchange',
  gift: 'Gift',
  purchaseAtVendorSystem: 'Purchase At Vendor System',
  purchase: 'Purchase',
  technical: 'Technical',
};

const FieldAcquisitionMethod = ({ disabled }) => (
  <Field
    component={Select}
    label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
    name="acquisitionMethod"
    required
    validate={[Required]}
    disabled={disabled}
  >
    <FormattedMessage id="ui-orders.dropdown.select">
      {(message) => <option value="">{message}</option>}
    </FormattedMessage>
    {Object.keys(ACQUISITION_METHOD).map((key) => (
      <FormattedMessage
        id={`ui-orders.acquisition_method.${key}`}
        key={key}
      >
        {(message) => <option value={ACQUISITION_METHOD[key]}>{message}</option>}
      </FormattedMessage>
    ))}
  </Field>
);

FieldAcquisitionMethod.propTypes = {
  disabled: PropTypes.bool,
};

export default FieldAcquisitionMethod;
