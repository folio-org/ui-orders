import uniq from 'lodash/uniq';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  useCentralOrderingContext,
  useConsortiumTenants,
  useHoldingsAbandonmentAnalyzer,
  usePublishCoordinator,
} from '@folio/stripes-acq-components';

import { UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES } from '../../constants';
import {
  checkRelatedHoldings,
  getHoldingIdsFromPOLines,
} from '../../utils';

const getUnopenOrderAbandonedType = (
  isSynchronizedPOLineHoldingsWillAbandoned,
  isIndependentPOLineHoldingsWillAbandoned,
) => {
  const {
    defaultType,
    independent,
    synchronized,
  } = UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES;

  if (isSynchronizedPOLineHoldingsWillAbandoned) {
    return synchronized;
  } else if (isIndependentPOLineHoldingsWillAbandoned) {
    return independent;
  }

  return defaultType;
};

export const useOrderLinesAbandonedHoldingsCheck = (poLines = [], options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'order-lines-abandoned-holdings' });

  const { isCentralOrderingEnabled } = useCentralOrderingContext();
  const { initPublicationRequest } = usePublishCoordinator();
  const { tenants, isLoading: isTenantsLoading } = useConsortiumTenants({ enabled: isCentralOrderingEnabled });

  const {
    analyzerFactory,
    isLoading: isAnalyzing,
  } = useHoldingsAbandonmentAnalyzer();

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
      const kyExtended = ky.extend({ signal });

      const requestHandlerOptions = {
        isCentralOrderingEnabled,
        initPublicationRequest,
        signal,
        tenants,
      };

      const synchronizedPOLinesHoldingIds = await getHoldingIdsFromPOLines(
        kyExtended,
        requestHandlerOptions,
      )(synchronizedPOLines);

      const independentPOLinesHoldingIds = uniq(
        independentPOLines
          .flatMap(({ locations }) => locations)
          .map(({ holdingId }) => holdingId)
          .filter(Boolean),
      );

      const analyzer = await analyzerFactory({
        // Combine holding IDs from both synchronized and independent PO lines for building the analysis context
        holdingIds: uniq([...synchronizedPOLinesHoldingIds, ...independentPOLinesHoldingIds]),
        signal,
      });

      const analyze = checkRelatedHoldings(analyzer);
      const synchronizedPOLinesCheckResult = analyze(synchronizedPOLines, synchronizedPOLinesHoldingIds);
      const independentPOLinesCheckResult = analyze(independentPOLines, independentPOLinesHoldingIds);

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
      enabled: Boolean(poLines.length && !isTenantsLoading),
      ...options,
    },
  );

  return {
    isFetching: isFetching || isAnalyzing || isTenantsLoading,
    result: data,
  };
};
