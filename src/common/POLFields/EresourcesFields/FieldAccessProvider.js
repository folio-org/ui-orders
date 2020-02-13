import React from 'react';
import PropTypes from 'prop-types';

import { FieldOrganization } from '../../POFields';

const FieldAccessProvider = ({ change, dispatch, disabled, required, accessProviderId }) => {
  return (
    <FieldOrganization
      dispatch={dispatch}
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
  dispatch: PropTypes.func.isRequired,
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
