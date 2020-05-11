import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { FieldSelectFinal } from '@folio/stripes-acq-components';

const FieldMaterialType = ({ name, materialTypes, disabled, required }) => (
  <FieldSelectFinal
    dataOptions={materialTypes}
    fullWidth
    label={<FormattedMessage id="ui-orders.poLine.materialType" />}
    name={name}
    required={required}
    disabled={disabled}
  />
);

FieldMaterialType.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldMaterialType.defaultProps = {
  required: false,
};

export default FieldMaterialType;
