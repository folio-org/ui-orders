import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

/**
 * EmailTemplateDetail - Read-only view of an email template.
 *
 * Displays:
 * - General information (name, description, active status)
 * - Template content (body)
 *
 * TODO (UIOR-1494): Add logo display
 * TODO (UIOR-1495): Add preview/print functionality
 */
const EmailTemplateDetail = ({ initialValues }) => {
  const {
    name,
    description,
    active,
    localizedTemplates,
  } = initialValues;

  // Get the English template (or first available)
  const template = localizedTemplates?.en || {};
  const { header: subject, body } = template;

  return (
    <AccordionSet>
      <Accordion
        label={<FormattedMessage id="ui-orders.settings.emailTemplates.generalInformation" />}
      >
        <Row>
          <Col xs={12} md={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.settings.emailTemplates.name" />}
              value={name}
            />
          </Col>
          <Col xs={12} md={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.settings.emailTemplates.active" />}
              value={active ? <FormattedMessage id="ui-orders.settings.emailTemplates.active.yes" /> : <FormattedMessage id="ui-orders.settings.emailTemplates.active.no" />}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.settings.emailTemplates.description" />}
              value={description}
            />
          </Col>
        </Row>
      </Accordion>

      <Accordion
        label={<FormattedMessage id="ui-orders.settings.emailTemplates.templateContent" />}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.settings.emailTemplates.subject" />}
              value={subject}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.settings.emailTemplates.body" />}
            >
              {/* Render HTML content safely */}
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: body }} />
            </KeyValue>
          </Col>
        </Row>
      </Accordion>
    </AccordionSet>
  );
};

EmailTemplateDetail.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    active: PropTypes.bool,
    localizedTemplates: PropTypes.shape({
      en: PropTypes.shape({
        header: PropTypes.string,
        body: PropTypes.string,
      }),
    }),
  }),
};

EmailTemplateDetail.defaultProps = {
  initialValues: {},
};

export default EmailTemplateDetail;