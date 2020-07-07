import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal as FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';

const FieldPrefix = ({ prefixes, disabled, ...rest }) => {
  return (
    <FieldSelect
      label={<FormattedMessage id="ui-orders.orderDetails.orderNumberPrefix" />}
      name="poNumberPrefix"
      dataOptions={prefixes}
      disabled={disabled}
      validateFields={[]}
      {...rest}
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
