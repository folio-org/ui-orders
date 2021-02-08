import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ACQUISITION_METHOD,
  FieldSelectFinal,
} from '@folio/stripes-acq-components';

const ACQUISITION_METHOD_OPTIONS = Object.keys(ACQUISITION_METHOD).map((key) => ({
  labelId: `ui-orders.acquisition_method.${key}`,
  value: ACQUISITION_METHOD[key],
}));

const FieldAcquisitionMethod = ({ disabled, required }) => (
  <FieldSelectFinal
    dataOptions={ACQUISITION_METHOD_OPTIONS}
    label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
    name="acquisitionMethod"
    required={required}
    isNonInteractive={disabled}
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
