import { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES } from '../../constants';
import {
  checkIndependentPOLinesAbandonedHoldings,
  checkSynchronizedPOLinesAbandonedHoldings,
} from '../../utils';

const getUnopenOrderAbandonedType = (
  isSynchronizedPOLineHoldingsWillAbandoned,
  isIndependenPOLineHoldingstWillAbandoned,
) => {
  const {
    independent,
    synchronized,
    defaultType,
  } = UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES;

  if (isSynchronizedPOLineHoldingsWillAbandoned) {
    return synchronized;
  } else if (isIndependenPOLineHoldingstWillAbandoned) {
    return independent;
  }

  return defaultType;
};

export const useOrderLinesAbandonedHoldingsCheck = (poLines = [], options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-lines-abandoned-holdings' });

  const {
    synchronized: synchronizedPOLines,
    independent: independentPOLines,
  } = useMemo(() => poLines.reduce(({ synchronized, independent }, poLine) => {
    const targetArray = poLine.checkinItems ? independent : synchronized;

    targetArray.push(poLine);

    return { synchronized, independent };
  }, {
    synchronized: [],
    independent: [],
  }), [poLines]);

  const { isFetching, data = {} } = useQuery(
    [namespace],
    async ({ signal }) => {
      ky.extend({ signal });

      const [
        synchronizedPOLinesCheckResult,
        independentPOLinesCheckResult,
      ] = await Promise.all([
        checkSynchronizedPOLinesAbandonedHoldings(ky)(synchronizedPOLines),
        checkIndependentPOLinesAbandonedHoldings(ky)(independentPOLines),
      ]);

      const isSynchronizedWillAbandoned = !!synchronizedPOLines.length && synchronizedPOLinesCheckResult.willAbandoned;
      const isIndependentWillAbandoned = !!independentPOLines.length && independentPOLinesCheckResult.willAbandoned;

      return {
        type: getUnopenOrderAbandonedType(isSynchronizedWillAbandoned, isIndependentWillAbandoned),
        holdingsItemsCountMap: {
          [UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.synchronized]: synchronizedPOLinesCheckResult.holdingsItemsCount,
          [UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.independent]: independentPOLinesCheckResult.holdingsItemsCount,
        },
      };
    },
    {
      enabled: Boolean(poLines.length),
      ...options,
    },
  );

  return {
    isFetching,
    result: data,
  };
};
