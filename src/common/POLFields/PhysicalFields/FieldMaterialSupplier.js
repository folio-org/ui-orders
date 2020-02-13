import React from 'react';
import PropTypes from 'prop-types';

import { FieldOrganization } from '../../POFields';

const FieldMaterialSupplier = ({ change, dispatch, disabled, materialSupplierId }) => {
  return (
    <FieldOrganization
      dispatch={dispatch}
      change={change}
      labelId="ui-orders.physical.materialSupplier"
      name="physical.materialSupplier"
      disabled={disabled}
      id={materialSupplierId}
      required={false}
    />
  );
};

FieldMaterialSupplier.propTypes = {
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  materialSupplierId: PropTypes.string,
};

FieldMaterialSupplier.defaultProps = {
  disabled: false,
};

export default FieldMaterialSupplier;
