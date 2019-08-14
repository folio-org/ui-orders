import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import { WORKFLOW_STATUS } from './FieldWorkflowStatus';
import FolioFormattedTime from "../../FolioFormattedTime";
// import css from './SummaryView.css';

const SummaryView = ({ order }) => {
  const workflowStatus = get(order, 'workflowStatus');

  return (
    <Fragment>
      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.orderSummary.totalUnits" />}
            value={get(order, 'totalItems')}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.orderSummary.approved" />}>
            <Checkbox
              checked={get(order, ['approved'])}
              disabled
            />
          </KeyValue>
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.orderSummary.approvalDate" />}>
            <FolioFormattedTime dateString={get(order, 'approvalDate')} />
          </KeyValue>
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.orderSummary.totalEstimatedPrice" />}
            value={get(order, 'totalEstimatedPrice')}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
            value={workflowStatus}
          />
        </Col>
      </Row>
      {(workflowStatus === WORKFLOW_STATUS.closed) && (
        <Row
          data-test-close-reason-block
          start="xs"
        >
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderSummary.closingReason" />}
              value={get(order, ['closeReason', 'reason'])}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderSummary.closingNote" />}
              value={get(order, ['closeReason', 'note'])}
            />
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

SummaryView.propTypes = {
  order: PropTypes.object,
};

SummaryView.defaultProps = {
  order: {},
};

SummaryView.displayName = 'SummaryView';

export default SummaryView;
