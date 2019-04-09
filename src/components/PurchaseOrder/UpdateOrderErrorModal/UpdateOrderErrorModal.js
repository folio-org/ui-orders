import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal } from '@folio/stripes/components';

const UpdateOrderErrorModal = ({ orderNumber, cancel, errorCode }) => {
  const footer = (
    <Button
      onClick={cancel}
      marginBottom0
    >
      <FormattedMessage id="ui-orders.openOrderModal.cancel" />
    </Button>
  );

  return (
    <Modal
      label={
        <FormattedMessage
          id="ui-orders.openOrderModal.title"
          values={{ orderNumber }}
        />}
      open
      footer={footer}
      data-test-update-order-error-modal
    >
      <FormattedMessage id={`ui-orders.errors.${errorCode}`} />
    </Modal>
  );
};

UpdateOrderErrorModal.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  errorCode: PropTypes.string.isRequired,
};

export default UpdateOrderErrorModal;
