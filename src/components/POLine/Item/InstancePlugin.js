import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

const InstancePlugin = ({
  addInstance,
  searchLabelId = 'ui-orders.itemDetails.titleLookUp',
  searchButtonStyle = 'link',
  disabled = false,
}) => {
  return (
    <Pluggable
      aria-haspopup="true"
      dataKey="instances"
      searchButtonStyle={searchButtonStyle}
      searchLabel={<FormattedMessage id={searchLabelId} />}
      selectInstance={addInstance}
      type="find-instance"
      disabled={disabled}
    >
      <span>
        <FormattedMessage id="ui-orders.itemDetails.titleLookUpNoPlugin" />
      </span>
    </Pluggable>
  );
};

InstancePlugin.propTypes = {
  addInstance: PropTypes.func.isRequired,
  searchLabelId: PropTypes.string,
  searchButtonStyle: PropTypes.string,
  disabled: PropTypes.bool,
};

export default InstancePlugin;
