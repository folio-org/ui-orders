import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { VendorReferenceNumbersFields } from '@folio/stripes-acq-components';

import {
  FieldVendorInstructions,
  FieldVendorAccountNumber,
} from '../../../../common/POLFields';

const POLineVendorForm = ({ accounts }) => {
  return (
    <Row>
      <Col
        xs={12}
        data-col-order-template-vendor-number
      >
        <VendorReferenceNumbersFields
          fieldName="vendorDetail.referenceNumbers"
          withValidation={false}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-account
      >
        <FieldVendorAccountNumber accounts={accounts} />
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

POLineVendorForm.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
};

POLineVendorForm.defaultProps = {
  accounts: [],
};

export default POLineVendorForm;
