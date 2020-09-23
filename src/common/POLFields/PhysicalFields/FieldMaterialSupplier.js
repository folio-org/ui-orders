import React from 'react';
import PropTypes from 'prop-types';

import { FieldOrganization } from '@folio/stripes-acq-components';

const FieldMaterialSupplier = ({ change, disabled, materialSupplierId }) => {
  return (
    <FieldOrganization
      change={change}
      labelId="ui-orders.physical.materialSupplier"
      name="physical.materialSupplier"
      isNonInteractive={disabled}
      id={materialSupplierId}
      required={false}
    />
  );
};

FieldMaterialSupplier.propTypes = {
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  materialSupplierId: PropTypes.string,
};

FieldMaterialSupplier.defaultProps = {
  disabled: false,
};

export default FieldMaterialSupplier;
