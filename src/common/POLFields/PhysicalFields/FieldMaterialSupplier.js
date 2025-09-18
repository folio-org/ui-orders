import PropTypes from 'prop-types';

import { FieldOrganization } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../constants';

const styles = {
  wrapper: {
    width: '100%',
  },
};

const FieldMaterialSupplier = ({
  change,
  disabled = false,
  materialSupplierId,
}) => {
  return (
    <div style={styles.wrapper}>
      <FieldOrganization
        change={change}
        labelId="ui-orders.physical.materialSupplier"
        name={POL_FORM_FIELDS.physicalMaterialSupplier}
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

export default FieldMaterialSupplier;
