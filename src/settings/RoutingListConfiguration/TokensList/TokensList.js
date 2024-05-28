import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Col,
  MessageBanner,
  Row,
} from '@folio/stripes/components';
import { TokensSection } from '@folio/stripes-template-editor';

export const TOKEN_SECTION = {
  ROUTING: 'routing',
};

const TokensList = (props) => {
  const {
    tokens,
    onSectionInit,
    onTokenSelect,
    intl: {
      formatMessage,
    },
  } = props;

  return (
    <Row data-testid="tokenListWrapper">
      <Col xs={12}>
        <TokensSection
          section={TOKEN_SECTION.ROUTING}
          header={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration.tokens.routing' })}
          tokens={tokens[TOKEN_SECTION.ROUTING]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
      <Col xs={12}>
        <MessageBanner type="warning">
          <FormattedMessage
            id="ui-orders.routing.list.accordion.tokens.description"
            values={{ br: <br /> }}
          />
        </MessageBanner>
      </Col>
    </Row>
  );
};

TokensList.propTypes = {
  tokens: PropTypes.object.isRequired,
  onSectionInit: PropTypes.func.isRequired,
  onTokenSelect: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TokensList);
