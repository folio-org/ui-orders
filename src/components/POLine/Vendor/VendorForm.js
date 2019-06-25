import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import {
  FieldRefNumberType,
  FieldVendorRefNumber,
  FieldVendorInstructions,
  FieldVendorAccountNumber,
  FieldVendorNote,
} from '../../../common/POLFields';
import { isWorkflowStatusOpen } from '../../PurchaseOrder/util';

const VendorForm = ({ order, accounts }) => {
  const isOpenedOrder = isWorkflowStatusOpen(order);
  const accountsDataOptions = accounts.map(({ accountNo }) => ({
    label: accountNo,
    value: accountNo,
  }));

  return (
    <Row>
      <Col xs={6}>
        <FieldVendorRefNumber />
      </Col>
      <Col xs={6}>
        <FieldRefNumberType />
      </Col>
      <Col xs={6}>
        <FieldVendorInstructions disabled={isOpenedOrder} />
      </Col>
      <Col xs={6}>
        <FieldVendorAccountNumber
          accounts={accountsDataOptions}
          disabled={isOpenedOrder}
        />
        <FieldVendorNote />
      </Col>
    </Row>
  );
};

VendorForm.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
};

VendorForm.defaultProps = {
  accounts: [],
};

export default VendorForm;
