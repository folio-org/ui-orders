import React, { useState } from 'react';
import { sanitize } from 'dompurify';
import HtmlToReact, { Parser } from 'html-to-react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  KeyValue,
  Layout,
  Row,
} from '@folio/stripes/components';
import {
  PreviewModal,
  tokensReducer,
} from '@folio/stripes-template-editor';

import { ROUTING_LIST_TOKEN } from './constants';

const RoutingListConfigurationEmailTemplate = ({ listConfig, emailTemplate }) => {
  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  const parser = new Parser();
  const rules = [
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];
  const purifyEmailTemplate = sanitize(emailTemplate);
  const parsedEmailTemplate = parser.parseWithInstructions(purifyEmailTemplate, () => true, rules);
  const [openPreview, setOpenPreview] = useState(false);

  const togglePreviewDialog = () => {
    setOpenPreview(!openPreview);
  };

  return (
    <div data-testid="emailAccordionContent">
      <Row>
        <Col xs={8}>
          <KeyValue
            value={<FormattedMessage id="ui-orders.settings.routing.listConfiguration.preview.display" />}
          />
        </Col>
        <Col xs={4}>
          <Layout className="flex justify-end">
            <Button onClick={togglePreviewDialog}>
              <FormattedMessage id="ui-orders.settings.routing.listConfiguration.preview.button" />
            </Button>
          </Layout>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.settings.routing.listConfiguration.body" />}
            value={parsedEmailTemplate}
          />
        </Col>
      </Row>
      <PreviewModal
        open={openPreview}
        header={
          <FormattedMessage
            id="ui-orders.settings.routing.listConfiguration.previewHeader"
            values={{ name: listConfig.name }}
          />
        }
        previewTemplate={emailTemplate}
        previewFormat={tokensReducer(ROUTING_LIST_TOKEN)}
        onClose={togglePreviewDialog}
      />
    </div>
  );
};

RoutingListConfigurationEmailTemplate.propTypes = {
  listConfig: PropTypes.object.isRequired,
  emailTemplate: PropTypes.string,
};

export default RoutingListConfigurationEmailTemplate;
