import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectionFinal,
} from '@folio/stripes-acq-components';

const FieldAcquisitionMethod = ({ acquisitionMethods, disabled, required }) => (
  <FieldSelectionFinal
    dataOptions={acquisitionMethods}
    label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
    name="acquisitionMethod"
    required={required}
    isNonInteractive={disabled}
  />
);

FieldAcquisitionMethod.propTypes = {
  acquisitionMethods: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldAcquisitionMethod.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldAcquisitionMethod;
