import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import {
  DeleteHoldingsModal,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { SHOW_DELETE_HOLDINGS_MODAL_CONFIGS } from '../constants';
import { useChangeInstanceModalConfigs } from '../hooks';
import { getUpdateHoldingsOptions } from '../utils';
import ChangeInstanceModal from './ChangeInstanceModal';

export const ChangeInstanceModalContainer = ({
  onSubmit,
  onCancel,
  poLine,
  selectedInstance,
}) => {
  const [operation, setOperation] = useState();
  const [isDeleteHoldingsModalOpen, toggleDeleteHoldingsModal] = useModalToggle();
  const {
    holdingsConfigs,
    isDetailed,
    isLoading,
  } = useChangeInstanceModalConfigs(poLine);

  const isMovingRestricted = holdingsConfigs.relatedToAnother;
  const updateHoldingsOptions = useMemo(() => {
    return getUpdateHoldingsOptions(isMovingRestricted);
  }, [isMovingRestricted]);

  return (
    <>
      <ChangeInstanceModal
        detailed={isDetailed}
        isLoading={isLoading}
        onCancel={onCancel}
        onSubmit={({ holdingsOperation }) => {
          setOperation(holdingsOperation);

          return (
            holdingsConfigs.willAbandoned
            && SHOW_DELETE_HOLDINGS_MODAL_CONFIGS[holdingsOperation]
          )
            ? toggleDeleteHoldingsModal()
            : onSubmit({ holdingsOperation });
        }}
        poLine={poLine}
        selectedInstance={selectedInstance}
        updateHoldingsOptions={updateHoldingsOptions}
      />

      {isDeleteHoldingsModalOpen && (
        <DeleteHoldingsModal
          onCancel={toggleDeleteHoldingsModal}
          onKeepHoldings={() => onSubmit({ holdingsOperation: operation })}
          onConfirm={() => onSubmit({
            holdingsOperation: operation,
            deleteAbandonedHoldings: true,
          })}
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
