import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Accordion,
  AccordionSet,
  Checkbox,
  Col,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import stripesFinalForm from '@folio/stripes/final-form';

/**
 * EmailTemplateForm - Create/Edit form for email templates.
 *
 * Fields:
 * - name (required)
 * - description
 * - active (checkbox)
 * - subject (email subject line)
 * - body (email content)
 *
 * TODO (UIOR-1493): Replace body TextArea with TemplateEditor for token support
 * TODO (UIOR-1494): Add logo upload functionality
 */
const EmailTemplateForm = ({
  handleSubmit,
  pristine,
  submitting,
}) => {
  return (
    <form
      id="email-template-form"
      onSubmit={handleSubmit}
    >
      <AccordionSet>
        <Accordion
          label={<FormattedMessage id="ui-orders.settings.emailTemplates.generalInformation" />}
        >
          <Row>
            <Col xs={12} md={6}>
              <Field
                name="name"
                label={<FormattedMessage id="ui-orders.settings.emailTemplates.name" />}
                component={TextField}
                required
                autoFocus
              />
            </Col>
            <Col xs={12} md={6}>
              <Field
                name="active"
                label={<FormattedMessage id="ui-orders.settings.emailTemplates.active" />}
                component={Checkbox}
                type="checkbox"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Field
                name="description"
                label={<FormattedMessage id="ui-orders.settings.emailTemplates.description" />}
                component={TextArea}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          label={<FormattedMessage id="ui-orders.settings.emailTemplates.templateContent" />}
        >
          <Row>
            <Col xs={12}>
              <Field
                name="localizedTemplates.en.header"
                label={<FormattedMessage id="ui-orders.settings.emailTemplates.subject" />}
                component={TextField}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Field
                name="localizedTemplates.en.body"
                label={<FormattedMessage id="ui-orders.settings.emailTemplates.body" />}
                component={TextArea}
                rows={10}
              />
              <p>
                <FormattedMessage id="ui-orders.settings.emailTemplates.body.hint" />
              </p>
            </Col>
          </Row>
        </Accordion>
      </AccordionSet>
    </form>
  );
};

EmailTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
})(EmailTemplateForm);
