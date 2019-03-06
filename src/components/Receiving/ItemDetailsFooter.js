import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Row,
} from '@folio/stripes/components';

const ItemDetailsFooter = ({
  checkedItemsListLength,
  close,
  currentLine,
  onClickNext,
  onClickPrevious,
  poLineIdsListLenght,
}) => (
  <Row end="xs">
    <Button
      onClick={close}
    >
      <FormattedMessage id="ui-orders.receiving.cancelBtn" />
    </Button>
    <Button
      buttonStyle="primary"
      onClick={onClickPrevious}
      disabled={!currentLine}
    >
      <FormattedMessage id="ui-orders.receiving.previousBtn" />
    </Button>
    {(currentLine === poLineIdsListLenght)
      ? (
        <Button
          buttonStyle="primary"
          disabled
        >
          <FormattedMessage id="ui-orders.receiving.receiveBtn" />
        </Button>
      )
      : (
        <Button
          buttonStyle="primary"
          onClick={onClickNext}
          disabled={!checkedItemsListLength}
        >
          <FormattedMessage id="ui-orders.receiving.nextBtn" />
        </Button>
      )
    }
  </Row>
);

ItemDetailsFooter.propTypes = {
  checkedItemsListLength: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  currentLine: PropTypes.number.isRequired,
  onClickNext: PropTypes.func.isRequired,
  onClickPrevious: PropTypes.func.isRequired,
  poLineIdsListLenght: PropTypes.number.isRequired,
};

export default ItemDetailsFooter;
