import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';

import css from './LinesLimit.css';

const LinesLimit = ({ cancel, createOrder }) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage({ id: 'ui-orders.linesLimit.label' });

  return (
    <Modal
      aria-label={modalLabel}
      id="data-test-lines-limit-modal"
      label={modalLabel}
      open
    >
      <Row>
        <Col xs={12}>
          <FormattedMessage id="ui-orders.linesLimit.reasonText" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <FormattedMessage id="ui-orders.linesLimit.adviceText" />
        </Col>
      </Row>
      <Row>
        <Col
          className={css.buttonsLine}
          xs={12}
        >
          <Button
            buttonStyle="primary"
            data-test-ok-button
            onClick={cancel}
          >
            <FormattedMessage id="ui-orders.linesLimit.okBtn" />
          </Button>
          <Button
            data-test-clone-order-and-create-line
            onClick={createOrder}
          >
            <FormattedMessage id="ui-orders.linesLimit.createBtn" />
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

LinesLimit.propTypes = {
  cancel: PropTypes.func.isRequired,
  createOrder: PropTypes.func.isRequired,
};

LinesLimit.displayName = 'LinesLimit';

export default LinesLimit;
