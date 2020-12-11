import React from 'react';
import PropTypes from 'prop-types';

import { FieldOrganization } from '@folio/stripes-acq-components';

const FieldAccessProvider = ({ accessProviderId, ...rest }) => {
  return (
    <FieldOrganization
      labelId="ui-orders.eresource.accessProvider"
      name="eresource.accessProvider"
      id={accessProviderId}
      {...rest}
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
  required: false,
};

export default FieldAccessProvider;
