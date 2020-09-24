import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { KeyValue, NoValue } from '@folio/stripes/components';

const FieldPOLineNumber = ({ poLineNumber }) => {
  return (
    <KeyValue
      data-test-po-line-number
      label={<FormattedMessage id="ui-orders.poLine.number" />}
      value={poLineNumber || <NoValue />}
    />
  );
};

FieldPOLineNumber.propTypes = {
  poLineNumber: PropTypes.string,
};

export default FieldPOLineNumber;
