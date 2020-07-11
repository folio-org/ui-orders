import React from 'react';
import PropTypes from 'prop-types';

import { FieldOrganization } from '../../POFields';

const FieldAccessProvider = ({ change, disabled, required, accessProviderId }) => {
  return (
    <FieldOrganization
      change={change}
      labelId="ui-orders.eresource.accessProvider"
      name="eresource.accessProvider"
      required={required}
      disabled={disabled}
      id={accessProviderId}
    />
  );
};

FieldAccessProvider.propTypes = {
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  accessProviderId: PropTypes.string,
};

FieldAccessProvider.defaultProps = {
  disabled: false,
  required: true,
};

export default FieldAccessProvider;
