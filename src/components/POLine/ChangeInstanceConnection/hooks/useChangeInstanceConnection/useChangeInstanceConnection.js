import { useCallback, useState } from 'react';
import noop from 'lodash/noop';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LINES_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { REPLACE_OPERATION_TYPE } from '../../constants';

export const useChangeInstanceConnection = (
  poLine,
  { refetch = noop } = {},
) => {
  const ky = useOkapiKy();
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
    const params = {
      operation: REPLACE_OPERATION_TYPE,
      replaceInstanceRef: {
        deleteAbandonedHoldings,
        holdingsOperation,
        newInstanceId: selectedInstance?.id,
      },
    };

    return ky.patch(`${LINES_API}/${poLine.id}`, { json: params })
      .json()
      .then((res) => {
        setShowConfirmChangeInstance(false);
        showCallout({
          messageId: 'ui-orders.line.changeInstance.success',
        });
        refetch();

        return res;
      });
  }, [ky, poLine.id, refetch, selectedInstance?.id, showCallout]);

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
