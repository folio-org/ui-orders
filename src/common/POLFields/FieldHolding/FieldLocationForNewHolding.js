import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  IconButton,
  TextField,
} from '@folio/stripes/components';

const FieldLocationForNewHolding = ({
  isNonInteractive,
  location,
  label,
  required,
  onClearLocation,
}) => {
  const clearButton = (
    <IconButton
      onClick={onClearLocation}
      icon="times-circle-solid"
      size="small"
    />
  );

  return isNonInteractive
    ? (
      <KeyValue
        label={label}
        value={`${location.name}(${location.code})`}
      />
    )
    : (
      <TextField
        label={label}
        required={required}
        disabled
        value={`${location.name}(${location.code})`}
        hasClearIcon={false}
        endControl={clearButton}
      />
    );
};

FieldLocationForNewHolding.propTypes = {
  isNonInteractive: PropTypes.bool,
  label: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  required: PropTypes.bool,
  onClearLocation: PropTypes.func.isRequired,
};

FieldLocationForNewHolding.defaultProps = {
  isNonInteractive: false,
  required: false,
};

export default FieldLocationForNewHolding;
