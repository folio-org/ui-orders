import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const InstancePlugin = ({ addInstance }) => {
  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="instances"
      searchButtonStyle="link"
      searchLabel={<FormattedMessage id="ui-orders.itemDetails.titleLookUp" />}
      selectInstance={addInstance}
      type="find-instance"
    >
      <span>
        <FormattedMessage id="ui-orders.itemDetails.titleLookUpNoPlugin" />
      </span>
    </Pluggable>
  );
};

InstancePlugin.propTypes = {
  addInstance: PropTypes.func.isRequired,
};

export default InstancePlugin;
