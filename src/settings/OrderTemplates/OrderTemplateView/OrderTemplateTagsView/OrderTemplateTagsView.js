import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const DEFAULT_TAGS = [];

const OrderTemplateTagsView = ({ tags = DEFAULT_TAGS }) => {
  return (
    <Row start="xs">
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.tags" />}
          value={tags.join(', ')}
        />
      </Col>
    </Row>
  );
};

OrderTemplateTagsView.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default OrderTemplateTagsView;
