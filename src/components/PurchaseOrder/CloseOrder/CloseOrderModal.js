import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  Select,
  TextArea,
} from '@folio/stripes/components';

import { closingReasonsShape } from '../../../common/shapes';
import { DEFAULT_CLOSE_ORDER_REASONS } from '../../../common/constants';

const CloseOrderModal = ({
  orderNumber,
  closingReasons,
  closeOrder,
  cancel,
}) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');

  const onChangeReason = useCallback(
    ({ target: { value } }) => (
      setReason(value)
    ),
    [],
  );

  const onChangeNote = useCallback(
    ({ target: { value } }) => (
      setNote(value)
    ),
    [],
  );

  const onClose = useCallback(
    () => closeOrder(reason, note),
    [closeOrder, reason, note],
  );

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-close-order-modal-submit
        disabled={!reason}
        onClick={onClose}
      >
        <FormattedMessage id="ui-orders.closeOrderModal.submit" />
      </Button>
      <Button
        data-test-close-order-modal-cancel
        onClick={cancel}
      >
        <FormattedMessage id="ui-orders.closeOrderModal.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      data-test-close-order-modal
      label={<FormattedMessage id="ui-orders.closeOrderModal.title" values={{ orderNumber }} />}
      footer={footer}
      open
    >
      <Row>
        <Col xs={12}>
          <Select
            autoFocus
            label={<FormattedMessage id="ui-orders.closeOrderModal.reason" />}
            data-test-closing-reasons
            onChange={onChangeReason}
            placeholder=" "
            defaultValue=""
          >
            {closingReasons.map(({ label, value }) => (
              <FormattedMessage
                id={`ui-orders.closeOrderModal.closingReasons.${DEFAULT_CLOSE_ORDER_REASONS[label]}`}
                defaultMessage={label}
                key={label}
              >
                {(message) => <option value={value}>{message}</option>}
              </FormattedMessage>
            ))}
          </Select>
          <TextArea
            label={<FormattedMessage id="ui-orders.closeOrderModal.notes" />}
            onChange={onChangeNote}
          />
        </Col>
      </Row>
    </Modal>
  );
};

CloseOrderModal.propTypes = {
  orderNumber: PropTypes.string,
  closingReasons: closingReasonsShape,
  closeOrder: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default CloseOrderModal;
