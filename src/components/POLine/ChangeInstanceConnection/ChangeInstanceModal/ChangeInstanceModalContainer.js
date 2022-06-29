import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  DeleteHoldingsModal,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  SHOW_DELETE_HOLDINGS_MODAL_CONFIGS,
} from '../constants';
import { useChangeInstanceModalConfigs } from '../hooks';
import { NotMovedItemsModal } from '../NotMovedItemsModal';
import { getUpdateHoldingsOptions } from '../utils';
import ChangeInstanceModal from './ChangeInstanceModal';

export const ChangeInstanceModalContainer = ({
  onSubmit,
  onCancel,
  poLine,
  selectedInstance,
}) => {
  const showCallout = useShowCallout();
  const [notMovedItems, setNotMovedItems] = useState([]);
  const [operation, setOperation] = useState();
  const [isDeleteHoldingsModalOpen, toggleDeleteHoldingsModal] = useModalToggle();
  const [isNotMovedItemsModalOpen, toggleNotMovedItemsModal] = useModalToggle();
  const {
    holdingsConfigs,
    isDetailed,
    isLoading,
  } = useChangeInstanceModalConfigs(poLine);

  const isMovingRestricted = holdingsConfigs.relatedToAnother;
  const updateHoldingsOptions = useMemo(() => {
    return getUpdateHoldingsOptions(isMovingRestricted);
  }, [isMovingRestricted]);

  const handleErrorResponse = useCallback(async ({ response }) => {
    let errorResponse;

    try {
      errorResponse = await response.json();
    } catch {
      errorResponse = response;
    }

    if (errorResponse.errors && errorResponse.errors.length) {
      const itemUpdateError = errorResponse.errors.find(el => el.code === ERROR_CODES.itemUpdateFailed);

      if (itemUpdateError) {
        const itemIds = itemUpdateError.parameters?.map(({ value }) => value);

        showCallout({
          values: { error: itemUpdateError.message },
          messageId: 'ui-orders.line.changeInstance.error',
          type: 'error',
        });

        setNotMovedItems(itemIds);
        toggleNotMovedItemsModal();

        return;
      }
    }

    onCancel();
    showCallout({
      messageId: 'ui-orders.errors.instanceWasNotChanged',
      type: 'error',
    });
  }, [onCancel, showCallout, toggleNotMovedItemsModal]);

  const handleSubmit = useCallback(({ holdingsOperation }) => {
    setOperation(holdingsOperation);

    return (
      holdingsConfigs.willAbandoned
      && SHOW_DELETE_HOLDINGS_MODAL_CONFIGS[holdingsOperation]
    )
      ? toggleDeleteHoldingsModal()
      : onSubmit({ holdingsOperation }).catch(handleErrorResponse);
  }, [
    handleErrorResponse,
    holdingsConfigs.willAbandoned,
    onSubmit,
    toggleDeleteHoldingsModal,
  ]);

  return (
    <>
      <ChangeInstanceModal
        detailed={isDetailed}
        isLoading={isLoading}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        poLine={poLine}
        selectedInstance={selectedInstance}
        updateHoldingsOptions={updateHoldingsOptions}
      />

      {isDeleteHoldingsModalOpen && (
        <DeleteHoldingsModal
          onCancel={toggleDeleteHoldingsModal}
          onKeepHoldings={() => onSubmit({ holdingsOperation: operation }).catch(handleErrorResponse)}
          onConfirm={() => onSubmit({
            holdingsOperation: operation,
            deleteAbandonedHoldings: true,
          }).catch(handleErrorResponse)}
        />
      )}

      {isNotMovedItemsModalOpen && (
        <NotMovedItemsModal
          itemIds={notMovedItems}
          onClose={toggleNotMovedItemsModal}
        />
      )}
    </>
  );
};

ChangeInstanceModalContainer.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  poLine: PropTypes.object.isRequired,
  selectedInstance: PropTypes.object.isRequired,
};
