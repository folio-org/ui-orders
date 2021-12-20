import React from 'react';
import PropTypes from 'prop-types';

import { FieldOrganization } from '@folio/stripes-acq-components';

const styles = {
  wrapper: {
    width: '100%',
  },
};

const FieldMaterialSupplier = ({ change, disabled, materialSupplierId }) => {
  return (
    <div style={styles.wrapper}>
      <FieldOrganization
        change={change}
        labelId="ui-orders.physical.materialSupplier"
        name="physical.materialSupplier"
        isNonInteractive={disabled}
        id={materialSupplierId}
        required={false}
      />
    </div>
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
