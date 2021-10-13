import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  Col,
  Row,
  Checkbox,
} from '@folio/stripes/components';

export const InstanceMatchingForm = () => (
  <>
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-orders.settings.instanceMatching.description" />
    </Layout>
    <Row>
      <Col xs={12}>
        <Field
          component={Checkbox}
          label={<FormattedMessage id="ui-orders.settings.instanceMatching.toggle" />}
          name="isInstanceMatchingDisabled"
          type="checkbox"
        />
      </Col>
    </Row>
  </>
);
