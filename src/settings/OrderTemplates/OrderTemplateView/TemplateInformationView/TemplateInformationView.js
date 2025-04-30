import get from 'lodash/get';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const TemplateInformationView = ({
  orderTemplate = {},
  orderTemplateCategories,
}) => {
  const categories = useMemo(() => {
    return orderTemplate?.categoryIds
      ?.map((categoryId) => orderTemplateCategories.find(({ id }) => id === categoryId)?.name ?? categoryId)
      ?.join(', ');
  }, [orderTemplate, orderTemplateCategories]);

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
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.categories" />}
          value={categories}
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
  orderTemplateCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
};

export default TemplateInformationView;
