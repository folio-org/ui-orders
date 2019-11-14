import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import {
  FieldRenewalInterval,
  FieldRenewalDate,
  FieldRenewalPeriod,
  FieldIsManualRenewal,
} from '../../../common/POFields';

import { isWorkflowStatusIsPending } from '../util';

const RenewalsForm = ({ order }) => {
  const isPostPendingOrder = Boolean(order.workflowStatus) && !isWorkflowStatusIsPending(order);

  return (
    <Row>
      <Col
        xs={6}
        md={3}
      >
        <FieldRenewalInterval disabled={isPostPendingOrder} />
      </Col>
      <Col
        xs={6}
        md={3}
      >
        <FieldRenewalDate disabled={isPostPendingOrder} />
      </Col>
      <Col
        xs={6}
        md={3}
      >
        <FieldRenewalPeriod disabled={isPostPendingOrder} />
      </Col>
      <Col
        xs={6}
        md={3}
      >
        <FieldIsManualRenewal disabled={isPostPendingOrder} />
      </Col>
    </Row>
  );
};

RenewalsForm.propTypes = {
  order: PropTypes.object.isRequired,
};

export default RenewalsForm;
