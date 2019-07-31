import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { FieldSelect } from '@folio/stripes-acq-components';

import normalizeEmptySelect from '../../components/Utils/normalizeEmptySelect';
import { requiredMaterialType } from '../../components/Utils/Validate';

const FieldMaterialType = ({ name, materialTypes, disabled, required }) => (
  <FieldSelect
    dataOptions={materialTypes}
    fullWidth
    label={<FormattedMessage id="ui-orders.poLine.materialType" />}
    name={name}
    normalize={normalizeEmptySelect}
    required={required}
    validate={required && [requiredMaterialType]}
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
