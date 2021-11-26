import React from 'react';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldIsApproved,
} from '../../../../common/POFields';
import { VisibilityControl } from '../../../../common/VisibilityControl';

const PurchaseOrderSummaryForm = () => {
  return (
    <Row>
      <Col xs={3}>
        <VisibilityControl name="hiddenFields.approved">
          <FieldIsApproved />
        </VisibilityControl>
      </Col>
    </Row>
  );
};

export default PurchaseOrderSummaryForm;
