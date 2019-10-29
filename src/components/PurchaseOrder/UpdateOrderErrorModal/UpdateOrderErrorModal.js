import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal } from '@folio/stripes/components';

const UpdateOrderErrorModal = ({ orderNumber, cancel, errors = [], title }) => {
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
      label={title || (
        <FormattedMessage
          id="ui-orders.openOrderModal.title"
          values={{ orderNumber }}
        />
      )}
      open
      footer={footer}
      data-test-update-order-error-modal
    >
      {errors.map(({ code, poLineNumber }, i) => (
        <p>
          <FormattedMessage
            key={`${i}_${poLineNumber}`}
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
