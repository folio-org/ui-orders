import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal as FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';

const FieldSuffix = ({ suffixes, disabled, ...rest }) => {
  return (
    <FieldSelect
      label={<FormattedMessage id="ui-orders.orderDetails.orderNumberSuffix" />}
      name="poNumberSuffix"
      dataOptions={suffixes}
      disabled={disabled}
      validateFields={[]}
      {...rest}
    />
  );
};

FieldSuffix.propTypes = {
  suffixes: fieldSelectOptionsShape.isRequired,
  disabled: PropTypes.bool,
};

FieldSuffix.defaultProps = {
  disabled: false,
};

export default FieldSuffix;
