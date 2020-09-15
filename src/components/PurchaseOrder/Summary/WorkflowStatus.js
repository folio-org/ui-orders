import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { ORDER_STATUS_LABEL } from '@folio/stripes-acq-components';
import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

function WorkflowStatus({ value }) {
  return (
    <KeyValue label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}>
      {value ? ORDER_STATUS_LABEL[value] : <NoValue />}
    </KeyValue>
  );
}

WorkflowStatus.propTypes = {
  value: PropTypes.string,
};

export default WorkflowStatus;
