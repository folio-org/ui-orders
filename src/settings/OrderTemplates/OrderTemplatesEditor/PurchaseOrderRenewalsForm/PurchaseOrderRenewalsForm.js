import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldRenewalInterval,
  FieldRenewalDate,
  FieldRenewalPeriod,
  FieldIsManualRenewal,
  FieldRenewalSubscription,
  FieldReviewDate,
  FieldOngoingInfoNotes,
} from '../../../../common/POFields';

const PurchaseOrderRenewalsForm = ({ ongoingFormValues }) => {
  return (
    <Row>
      <Col
        xs={6}
        md={3}
      >
        <FieldRenewalSubscription disabled={false} />
      </Col>
      {ongoingFormValues?.isSubscription ? (
        <>
          <Col
            xs={6}
            md={3}
          >
            <FieldRenewalInterval disabled={false} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldRenewalDate disabled={false} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldRenewalPeriod disabled={false} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldIsManualRenewal disabled={false} />
          </Col>
        </>
      ) : (
        <Col
          xs={6}
          md={3}
        >
          <FieldReviewDate disabled={false} />
        </Col>
      )}
      <Col
        xs={6}
        md={3}
      >
        <FieldOngoingInfoNotes disabled={false} />
      </Col>
    </Row>
  );
};

PurchaseOrderRenewalsForm.propTypes = {
  ongoingFormValues: PropTypes.object.isRequired,
};

export default PurchaseOrderRenewalsForm;
