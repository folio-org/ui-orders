import React from 'react';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldRefNumberType,
  FieldVendorRefNumber,
  FieldVendorInstructions,
  FieldVendorAccountNumber,
  FieldVendorNote,
} from '../../../../common/POLFields';

const POLineVendorForm = () => {
  return (
    <Row>
      <Col
        xs={3}
        data-col-order-template-vendor-number
      >
        <FieldVendorRefNumber />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-ref-type
      >
        <FieldRefNumberType />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-account
      >
        <FieldVendorAccountNumber />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-note
      >
        <FieldVendorNote />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-instruction
      >
        <FieldVendorInstructions />
      </Col>
    </Row>
  );
};

export default POLineVendorForm;
