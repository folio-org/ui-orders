import React, { useEffect, useCallback, useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
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
import { useCloseReasonOptions } from '../../../common/hooks';
import { CANCEL_ORDER_REASON } from '../../../common/constants';

const CloseOrderModal = ({
  cancel,
  closeOrder,
  closingReasons,
  intl: { formatMessage },
  orderNumber,
  isCancelReason = false,
}) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const closeReasonOptions = useCloseReasonOptions(formatMessage, closingReasons);

  const modalLabel = formatMessage(
    { id: 'ui-orders.closeOrderModal.title' },
    { orderNumber },
  );

  useEffect(() => {
    if (isCancelReason) setReason(CANCEL_ORDER_REASON);
  }, [isCancelReason]);

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
      aria-label={modalLabel}
      data-test-close-order-modal
      label={modalLabel}
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
            value={reason}
            dataOptions={closeReasonOptions}
            disabled={isCancelReason}
          />
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
  cancel: PropTypes.func.isRequired,
  closeOrder: PropTypes.func.isRequired,
  closingReasons: closingReasonsShape,
  intl: PropTypes.object.isRequired,
  orderNumber: PropTypes.string,
  isCancelReason: PropTypes.bool,
};

export default injectIntl(CloseOrderModal);
