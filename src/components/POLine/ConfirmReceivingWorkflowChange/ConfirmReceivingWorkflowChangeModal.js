import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const ConfirmReceivingWorkflowChangeModal = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmationModal
      open={isOpen}
      heading={<FormattedMessage id="ui-orders.poLine.receivingWorkflow.confirmModal.heading" />}
      message={<FormattedMessage id="ui-orders.poLine.receivingWorkflow.confirmModal.message" />}
      confirmLabel={<FormattedMessage id="stripes-core.button.confirm" />}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

ConfirmReceivingWorkflowChangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
