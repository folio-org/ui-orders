import { useCallback, useState } from 'react';

import {
  useShowCallout,
} from '@folio/stripes-acq-components';

export const useChangeInstanceConnection = (poLine) => {
  const showCallout = useShowCallout();
  const [selectedInstance, setSelectedInstance] = useState();
  const [showConfirmChangeInstance, setShowConfirmChangeInstance] = useState(false);

  const onSelectInstance = useCallback((data) => {
    setSelectedInstance(data);
    setShowConfirmChangeInstance(true);
  }, []);

  const submitChangeInstance = useCallback(({
    deleteAbandonedHoldings,
    holdingsOperation,
  }) => {
    // TODO: connect with BE
    const params = {
      deleteAbandonedHoldings,
      holdingsOperation,
      newInstanceId: selectedInstance.id,
    };

    setShowConfirmChangeInstance(false);

    return showCallout({
      messageId: 'ui-orders.errors.instanceWasNotChanged',
      type: 'error',
    });
  }, [selectedInstance?.id, showCallout]);

  const cancelChangeInstance = useCallback(() => {
    setShowConfirmChangeInstance(false);
  }, []);

  return {
    cancelChangeInstance,
    onSelectInstance,
    selectedInstance,
    showConfirmChangeInstance,
    submitChangeInstance,
  };
};
