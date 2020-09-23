import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal as FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';

const FieldSuffix = ({ suffixes, ...rest }) => {
  return (
    <FieldSelect
      label={<FormattedMessage id="ui-orders.orderDetails.orderNumberSuffix" />}
      name="poNumberSuffix"
      dataOptions={suffixes}
      validateFields={[]}
      {...rest}
    />
  );
};

FieldSuffix.propTypes = {
  suffixes: fieldSelectOptionsShape.isRequired,
  isNonInteractive: PropTypes.bool,
};

export default FieldSuffix;
