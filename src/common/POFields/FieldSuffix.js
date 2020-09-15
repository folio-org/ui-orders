import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal as FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';
import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const FieldSuffix = ({ suffixes, isNonInteractive, ...rest }) => {
  return isNonInteractive
    ? (
      <KeyValue
        label={<FormattedMessage id="ui-orders.orderDetails.orderNumberSuffix" />}
        value={isNonInteractive || <NoValue />}
      />
    )
    : (
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
  isNonInteractive: PropTypes.node,
};

export default FieldSuffix;
