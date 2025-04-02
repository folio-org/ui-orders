import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { IfPermission } from '@folio/stripes/core';
import {
  Row,
  Col,
  KeyValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  IfFieldVisible,
} from '@folio/stripes-acq-components';

import { FieldIsApproved } from '../../../common/POFields';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
} from '../util';
import { FieldNotesOnClosure } from './FieldNotesOnClosure';
import FieldWorkflowStatus from './FieldWorkflowStatus';
import TotalUnits from './TotalUnits';

const SummaryForm = ({ initialValues: order, hiddenFields = {} }) => (
  <Row>
    <Col
      xs={6}
      md={3}
    >
      <TotalUnits value={order.totalItems} />
    </Col>
    <Col
      xs={6}
      md={3}
    >
      <KeyValue label={<FormattedMessage id="ui-orders.orderSummary.totalEstimatedPrice" />}>
        <AmountWithCurrencyField amount={order.totalEstimatedPrice} />
      </KeyValue>
    </Col>

    <IfPermission perm="orders.item.approve">
      <IfFieldVisible
        visible={!hiddenFields.approved}
        name="approved"
      >
        <Col
          xs={6}
          md={3}
        >
          <FieldIsApproved disabled={Boolean(order.workflowStatus) && !isWorkflowStatusIsPending(order)} />
        </Col>
      </IfFieldVisible>
    </IfPermission>

    <Col
      xs={6}
      md={3}
    >
      <FieldWorkflowStatus isNonInteractive />
    </Col>

    <Col
      xs={12}
      md={6}
    >
      {isWorkflowStatusClosed(order) && <FieldNotesOnClosure />}
    </Col>
  </Row>
);

SummaryForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  hiddenFields: PropTypes.object,
};

export default SummaryForm;
