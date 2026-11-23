import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal } from '@folio/stripes/components';

export const OpenOrderModal = ({
  children,
  isLoading = false,
  onCancel,
  onSubmit,
  orderNumber,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage(
    { id: 'ui-orders.openOrderModal.title' },
    { orderNumber },
  );

  const footer = (
    <div>
      <Button
        onClick={onCancel}
        data-test-open-order-confirmation-modal-cancel
        marginBottom0
      >
        <FormattedMessage id="ui-orders.openOrderModal.cancel" />
      </Button>

      <Button
        buttonStyle="primary"
        data-test-open-order-confirmation-modal-submit
        disabled={isLoading}
        marginBottom0
        onClick={onSubmit}
      >
        <FormattedMessage id="ui-orders.openOrderModal.submit" />
      </Button>
    </div>
  );

  return (
    <Modal
      aria-label={modalLabel}
      label={modalLabel}
      open
      data-test-open-order-confirmation-modal
      footer={footer}
    >
      <div data-test-open-order-confirmation-modal-content>
        {children}

        <div>
          <FormattedMessage id="ui-orders.openOrderModal.message" />
        </div>
      </div>
    </Modal>
  );
};

OpenOrderModal.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};
