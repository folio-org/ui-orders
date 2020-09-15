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

const FieldPrefix = ({ prefixes, isNonInteractive, ...rest }) => {
  return isNonInteractive
    ? (
      <KeyValue
        label={<FormattedMessage id="ui-orders.orderDetails.orderNumberPrefix" />}
        value={isNonInteractive || <NoValue />}
      />
    )
    : (
      <FieldSelect
        label={<FormattedMessage id="ui-orders.orderDetails.orderNumberPrefix" />}
        name="poNumberPrefix"
        dataOptions={prefixes}
        validateFields={[]}
        {...rest}
      />
    );
};

FieldPrefix.propTypes = {
  prefixes: fieldSelectOptionsShape.isRequired,
  isNonInteractive: PropTypes.node,
};

export default FieldPrefix;
