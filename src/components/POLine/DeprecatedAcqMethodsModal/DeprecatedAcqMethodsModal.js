import PropTypes from 'prop-types';

import { BaseOpenOrderModal } from '../../../common/BaseOpenOrderModal';

export const DeprecatedAcqMethodsModal = ({
  deprecatedAcqMethods,
  isOpen,
  onCancel,
  onConfirm,
  orderNumber,
}) => {
  if (!isOpen) return null;

  return (
    <BaseOpenOrderModal
      deprecatedAcqMethods={deprecatedAcqMethods}
      onCancel={onCancel}
      onSubmit={onConfirm}
      orderNumber={orderNumber}
    />
  );
};

DeprecatedAcqMethodsModal.propTypes = {
  deprecatedAcqMethods: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};
