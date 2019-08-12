import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
} from '@folio/stripes/components';

const OrderApprovalsForm = () => (
  <Row>
    <Col xs={12}>
      <Field
        component={Checkbox}
        label={<FormattedMessage id="ui-orders.settings.approvals.isApprovalRequired" />}
        name="isApprovalRequired"
        type="checkbox"
      />
    </Col>
  </Row>
);

export default OrderApprovalsForm;
