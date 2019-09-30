import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';

const FieldPrefix = ({ prefixes, disabled }) => {
  return (
    <FieldSelect
      label={<FormattedMessage id="ui-orders.orderDetails.orderNumberPrefix" />}
      name="numberPrefix"
      dataOptions={prefixes}
      disabled={disabled}
    />
  );
};

FieldPrefix.propTypes = {
  prefixes: fieldSelectOptionsShape.isRequired,
  disabled: PropTypes.bool,
};

FieldPrefix.defaultProps = {
  disabled: false,
};

export default FieldPrefix;
