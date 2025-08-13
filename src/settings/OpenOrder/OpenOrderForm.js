import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
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
