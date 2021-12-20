import React from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  TextField,
  TextArea,
} from '@folio/stripes/components';
import { validateRequired } from '@folio/stripes-acq-components';

import { FieldHideAll } from './FieldHideAll';

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
          validateFields={[]}
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
          validateFields={[]}
        />
      </Col>

      <Col xs={3}>
        <Field
          component={TextArea}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.description" />}
          name="templateDescription"
          validateFields={[]}
        />
      </Col>

      <Col xs={3}>
        <FieldHideAll />
      </Col>
    </Row>
  );
};

export default TemplateInformationForm;
