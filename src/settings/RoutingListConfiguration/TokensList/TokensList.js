import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { TokensSection } from '@folio/stripes-template-editor';

export const TOKEN_SECTION = {
  ROUTING: 'routing',
};

const TokensList = (props) => {
  const {
    selectedCategory,
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
          selectedCategory={selectedCategory}
          header={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration.tokens.routing' })}
          tokens={tokens[TOKEN_SECTION.ROUTING]}
          onSectionInit={onSectionInit}
          onTokenSelect={onTokenSelect}
        />
      </Col>
    </Row>
  );
};

TokensList.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  tokens: PropTypes.object.isRequired,
  onSectionInit: PropTypes.func.isRequired,
  onTokenSelect: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(TokensList);
