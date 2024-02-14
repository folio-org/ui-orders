import React from 'react';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { VisibilityControl } from '@folio/stripes-acq-components';

import {
  FieldIsApproved,
} from '../../../../common/POFields';

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
