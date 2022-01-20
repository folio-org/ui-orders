import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Checkbox,
} from '@folio/stripes/components';

const OpenOrderForm = () => (
  <Row>
    <Col xs={12}>
      <Field
        component={Checkbox}
        label={<FormattedMessage id="ui-orders.settings.openOrder.isOpenOrderEnabled" />}
        name="isOpenOrderEnabled"
        type="checkbox"
      />
    </Col>

    <Col xs={12}>
      <Field
        component={Checkbox}
        label={<FormattedMessage id="ui-orders.settings.openOrder.isDuplicateCheckDisabled" />}
        name="isDuplicateCheckDisabled"
        type="checkbox"
      />
    </Col>
  </Row>
);

export default OpenOrderForm;
