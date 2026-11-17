import React from 'react';
import PropTypes from 'prop-types';

import { BaseOpenOrderModal } from '../../../common/BaseOpenOrderModal';
import { useDeprecatedAcqMethods } from '../../../common/hooks';

const OpenOrderConfirmationModal = ({
  orderNumber,
  orderLines,
  submit,
  cancel,
}) => {
  const { deprecatedAcqMethods, isLoading } = useDeprecatedAcqMethods(orderLines);

  return (
    <BaseOpenOrderModal
      deprecatedAcqMethods={deprecatedAcqMethods}
      isLoading={isLoading}
      onCancel={cancel}
      onSubmit={submit}
      orderNumber={orderNumber}
    />
  );
};

OpenOrderConfirmationModal.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  orderLines: PropTypes.arrayOf(PropTypes.object),
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default OpenOrderConfirmationModal;
