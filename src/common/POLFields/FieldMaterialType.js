import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelectFinal } from '@folio/stripes-acq-components';

const FieldMaterialType = ({
  disabled = false,
  materialTypes,
  required = false,
  ...props
}) => (
  <FieldSelectFinal
    dataOptions={materialTypes}
    disabled={disabled}
    fullWidth
    label={<FormattedMessage id="ui-orders.poLine.materialType" />}
    required={required}
    {...props}
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

export default FieldMaterialType;
