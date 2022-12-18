import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const BreakInstanceConnectionModal = ({
  onCancel,
  onConfirm,
  title,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage({ id: 'ui-orders.breakInstanceConnection.modal.heading' });
  const message = (
    <FormattedMessage
      id="ui-orders.breakInstanceConnection.modal.message"
      values={{ titleOrPackage: title }}
    />
  );

  return (
    <ConfirmationModal
      aria-label={modalLabel}
      id="break-instance-connection-confirmation"
      confirmLabel={<FormattedMessage id="ui-orders.button.confirm" />}
      heading={modalLabel}
      message={message}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open
    />
  );
};

BreakInstanceConnectionModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
};
