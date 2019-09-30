import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

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

const ACQUISITION_METHOD_OPTIONS = Object.keys(ACQUISITION_METHOD).map((key) => ({
  labelId: `ui-orders.acquisition_method.${key}`,
  value: ACQUISITION_METHOD[key],
}));

const FieldAcquisitionMethod = ({ disabled, required }) => (
  <FieldSelect
    dataOptions={ACQUISITION_METHOD_OPTIONS}
    label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
    name="acquisitionMethod"
    required={required}
    disabled={disabled}
  />
);

FieldAcquisitionMethod.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldAcquisitionMethod.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldAcquisitionMethod;
