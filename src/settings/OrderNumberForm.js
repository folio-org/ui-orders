import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Checkbox,
  Col,
  Row,
} from '@folio/stripes/components';

const OrderNumberForm = () => (
  <Row>
    <Col xs={12}>
      <Field
        component={Checkbox}
        label={<FormattedMessage id="ui-orders.settings.poNumber.editPONumber" />}
        name="canUserEditOrderNumber"
        type="checkbox"
      />
    </Col>
  </Row>
);

export default OrderNumberForm;
