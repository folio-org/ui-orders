import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Col,
  Modal,
  Row,
  Select,
  TextArea,
} from '@folio/stripes/components';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../../../common/constants';
import { getClosingReasonsOptions } from '../../../common/utils';

import css from './CloseOrderModal.css';

class CloseOrderModal extends Component {
  static propTypes = {
    orderNumber: PropTypes.string,
    closingReasons: PropTypes.arrayOf(PropTypes.object),
    closeOrder: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      reason: '',
      note: '',
    };
  }

  reasonChanged = (e) => {
    this.setState({ reason: e.target.value });
  }

  noteChanged = (e) => {
    this.setState({ note: e.target.value });
  }

  render() {
    const { orderNumber, closingReasons, closeOrder, cancel } = this.props;
    const reasons = getClosingReasonsOptions(closingReasons);

    return (
      <Modal
        data-test-close-order-modal
        label={<FormattedMessage id="ui-orders.closeOrderModal.title" values={{ orderNumber }} />}
        open
      >
        <Row>
          <Col xs={12}>
            <Select
              autoFocus
              label={<FormattedMessage id="ui-orders.closeOrderModal.reason" />}
              data-test-closing-reasons
              dataOptions={reasons}
              onChange={this.reasonChanged}
              placeholder=" "
              defaultValue=""
            >
              {Object.keys(DEFAULT_CLOSE_ORDER_REASONS).map((key) => (
                <FormattedMessage
                  id={`ui-orders.closeOrderModal.closingReasons.${key}`}
                  key={key}
                >
                  {(message) => <option value={DEFAULT_CLOSE_ORDER_REASONS[key]}>{message}</option>}
                </FormattedMessage>
              ))}
            </Select>
            <TextArea
              label={<FormattedMessage id="ui-orders.closeOrderModal.notes" />}
              onChange={this.noteChanged}
            />
          </Col>
        </Row>
        <Row>
          <Col
            className={css.buttonsLine}
            xs={12}
          >
            <Button
              buttonStyle="primary"
              data-test-close-order-modal-submit
              disabled={!this.state.reason}
              onClick={() => closeOrder(this.state.reason, this.state.note)}
            >
              <FormattedMessage id="ui-orders.closeOrderModal.submit" />
            </Button>
            <Button
              data-test-close-order-modal-cancel
              onClick={cancel}
            >
              <FormattedMessage id="ui-orders.closeOrderModal.cancel" />
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default CloseOrderModal;
