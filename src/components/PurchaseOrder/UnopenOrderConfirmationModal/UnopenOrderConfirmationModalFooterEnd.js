import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES } from '../../../common/constants';

export const UnopenOrderConfirmationModalFooterEnd = ({
  id,
  itemsCount,
  modalType,
  onConfirm,
}) => {
  const { synchronized, independent } = UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES;

  const confirmWithDeleteHoldings = useCallback(() => onConfirm({ deleteHoldings: true }), [onConfirm]);
  const confirmWithKeepHoldings = useCallback(() => onConfirm({ deleteHoldings: false }), [onConfirm]);

  if ([synchronized, independent].includes(modalType)) {
    // If there are no items in the related holdings, then use the 'independent' key, which doesn't factor in items.
    const translationKey = itemsCount === 0 ? independent : modalType;

    return (
      <>
        <Button
          id={`clickable-${id}-confirm-delete-holdings`}
          buttonStyle="primary"
          marginBottom0
          onClick={confirmWithDeleteHoldings}
        >
          <FormattedMessage id={`ui-orders.unopenOrderModal.confirmLabel.deleteHoldings.${translationKey}`} />
        </Button>
        <Button
          id={`clickable-${id}-confirm-keep-holdings`}
          buttonStyle="primary"
          marginBottom0
          onClick={confirmWithKeepHoldings}
        >
          <FormattedMessage id={`ui-orders.unopenOrderModal.confirmLabel.keepHoldings.${translationKey}`} />
        </Button>
      </>
    );
  }

  return (
    <Button
      id={`clickable-${id}-confirm`}
      buttonStyle="primary"
      marginBottom0
      onClick={confirmWithKeepHoldings}
    >
      <FormattedMessage id="ui-orders.unopenOrderModal.confirmLabel" />
    </Button>
  );
};

UnopenOrderConfirmationModalFooterEnd.defaultProps = {
  modalType: UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.defaultType,
};

UnopenOrderConfirmationModalFooterEnd.propTypes = {
  id: PropTypes.string.isRequired,
  itemsCount: PropTypes.number.isRequired,
  modalType: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
};
