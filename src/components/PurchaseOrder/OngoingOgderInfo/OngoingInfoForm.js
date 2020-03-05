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
  FieldRenewalSubscription,
  FieldReviewDate,
  FieldOngoingInfoNotes,
} from '../../../common/POFields';

import { isWorkflowStatusIsPending } from '../util';

const OngoingInfoForm = ({
  order,
  ongoingFormValues,
}) => {
  const isPostPendingOrder = Boolean(order?.workflowStatus) && !isWorkflowStatusIsPending(order);

  return (
    <Row>
      <Col
        xs={6}
        md={3}
      >
        <FieldRenewalSubscription disabled={isPostPendingOrder} />
      </Col>
      {ongoingFormValues?.isSubscription ? (
        <>
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
        </>
      ) : (
        <Col
          xs={6}
          md={3}
        >
          <FieldReviewDate disabled={isPostPendingOrder} />
        </Col>
      )}
      <Col
        xs={6}
        md={3}
      >
        <FieldOngoingInfoNotes disabled={isPostPendingOrder} />
      </Col>
    </Row>
  );
};

OngoingInfoForm.propTypes = {
  order: PropTypes.object,
  ongoingFormValues: PropTypes.object,
};

export default OngoingInfoForm;
