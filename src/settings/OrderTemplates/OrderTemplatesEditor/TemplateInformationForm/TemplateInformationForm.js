import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  TextField,
  TextArea,
} from '@folio/stripes/components';
import { validateRequired } from '@folio/stripes-acq-components';

const TemplateInformationForm = () => {
  return (
    <Row>
      <Col xs={3}>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name" />}
          name="templateName"
          required
          validate={validateRequired}
          type="text"
        />
      </Col>

      <Col xs={3}>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.code" />}
          name="templateCode"
          type="text"
        />
      </Col>

      <Col xs={3}>
        <Field
          component={TextArea}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.description" />}
          name="templateDescription"
        />
      </Col>
    </Row>
  );
};

export default TemplateInformationForm;
