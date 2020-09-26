import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { FieldSelectFinal } from '@folio/stripes-acq-components';

const FieldMaterialType = ({ materialTypes, ...rest }) => (
  <FieldSelectFinal
    dataOptions={materialTypes}
    fullWidth
    label={<FormattedMessage id="ui-orders.poLine.materialType" />}
    {...rest}
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
