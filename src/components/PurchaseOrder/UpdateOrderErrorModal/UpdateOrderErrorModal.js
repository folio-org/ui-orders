import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal } from '@folio/stripes/components';

const UpdateOrderErrorModal = ({ orderNumber, cancel, errors = [], title }) => {
  const intl = useIntl();

  const modalLabel = title || intl.formatMessage(
    { id: 'ui-orders.openOrderModal.title' },
    { orderNumber },
  );

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
      aria-label={modalLabel}
      label={modalLabel}
      open
      footer={footer}
      data-test-update-order-error-modal
    >
      {errors.map(({ code, poLineNumber }, i) => (
        <p key={`${i}_${poLineNumber}`}>
          <FormattedMessage
            id={`ui-orders.errors.${code}`}
            values={{ poLineNumber }}
          />
        </p>
      ))}
    </Modal>
  );
};

UpdateOrderErrorModal.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.node,
};

export default UpdateOrderErrorModal;
