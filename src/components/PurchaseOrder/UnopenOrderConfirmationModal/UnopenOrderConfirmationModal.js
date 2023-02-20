import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Loading,
  Modal,
} from '@folio/stripes/components';
import {
  getErrorCodeFromResponse,
  ModalFooter,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useOrderLinesAbandonedHoldingsCheck } from '../../../common/hooks';
import { getCommonErrorMessage } from '../../../common/utils';
import { UnopenOrderConfirmationModalFooterEnd } from './UnopenOrderConfirmationModalFooterEnd';

const modalId = 'order-unopen-confirmation';

export const UnopenOrderConfirmationModal = ({
  compositeOrder,
  onCancel,
  onConfirm,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const orderNumber = compositeOrder?.poNumber;
  const poLines = compositeOrder?.compositePoLines;
  const modalLabel = intl.formatMessage(
    { id: 'ui-orders.unopenOrderModal.title' },
    { orderNumber },
  );

  const onError = useCallback(async ({ response }) => {
    const errorCode = await getErrorCodeFromResponse(response);
    const defaultMessage = intl.formatMessage({ id: 'ui-orders.order.unopen.error' });
    const message = getCommonErrorMessage(errorCode, defaultMessage);

    onCancel();
    showCallout({
      message,
      type: 'error',
    });
  }, [intl, onCancel, showCallout]);

  const {
    result,
    isFetching,
  } = useOrderLinesAbandonedHoldingsCheck(poLines, { onError });

  const modalType = result.type;

  const modalFooterStart = useMemo(() => (
    <Button
      id={`clickable-${modalId}-cancel`}
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  ), [onCancel]);

  const modalFooterEnd = useMemo(() => (
    isFetching
      ? <Loading />
      : (
        <UnopenOrderConfirmationModalFooterEnd
          id={modalId}
          onConfirm={onConfirm}
          modalType={modalType}
        />
      )
  ), [isFetching, modalType, onConfirm]);

  const modalFooter = useMemo(() => (
    <ModalFooter
      renderStart={modalFooterStart}
      renderEnd={modalFooterEnd}
    />
  ), [modalFooterEnd, modalFooterStart]);

  return (
    <Modal
      open
      id={modalId}
      size="small"
      footer={modalFooter}
      label={modalLabel}
      aria-label={modalLabel}
    >
      {
      isFetching
        ? <Loading />
        : <FormattedMessage id={`ui-orders.unopenOrderModal.message.${modalType}`} />
      }
    </Modal>
  );
};

UnopenOrderConfirmationModal.propTypes = {
  compositeOrder: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
