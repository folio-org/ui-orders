import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const TemplateInformationView = ({ orderTemplate = {} }) => {
  return (
    <Row start="xs">
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name" />}
          value={get(orderTemplate, 'templateName')}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.code" />}
          value={get(orderTemplate, 'templateCode')}
        />
      </Col>

      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.description" />}
          value={get(orderTemplate, 'templateDescription')}
        />
      </Col>
    </Row>
  );
};

TemplateInformationView.propTypes = {
  orderTemplate: PropTypes.object,
};

export default TemplateInformationView;
