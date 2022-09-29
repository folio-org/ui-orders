import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Loading,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import {
  useOrganization,
} from '@folio/stripes-acq-components';

import { REEXPORT_SOURCES } from '../constants';

export const ReexportModal = ({
  id,
  onCancel,
  onConfirm,
  order,
  source,
}) => {
  const intl = useIntl();
  const { organization, isLoading } = useOrganization(order.vendor);

  const modalLabel = intl.formatMessage({ id: `ui-orders.reexport.${source}.confirmModal.heading` });

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onConfirm}
        disabled={isLoading}
      >
        <FormattedMessage id="ui-orders.button.confirm" />
      </Button>

      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-orders.buttons.line.cancel" />
      </Button>
    </ModalFooter>
  );

  const message = (
    <FormattedMessage
      id={`ui-orders.reexport.${source}.confirmModal.message`}
      values={{
        vendorFromOrder: organization?.name,
      }}
    />
  );

  return (
    <Modal
      aria-label={modalLabel}
      open
      id={id}
      label={modalLabel}
      footer={footer}
    >
      {isLoading ? <Loading /> : message}
    </Modal>
  );
};

ReexportModal.propTypes = {
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  source: PropTypes.oneOf(Object.values(REEXPORT_SOURCES)),
};
