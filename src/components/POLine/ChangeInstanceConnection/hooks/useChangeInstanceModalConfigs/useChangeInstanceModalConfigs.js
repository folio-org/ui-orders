import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  HoldingsAbandonmentPOLineStrategy,
  useCentralOrderingContext,
  useHoldingsAbandonmentAnalyzer,
  usePublishCoordinator,
} from '@folio/stripes-acq-components';

import {
  checkRelatedHoldings,
  getHoldingIdsFromPOLines,
} from '../../../../../common/utils';
import { getCreateInventory } from '../../../utils';
import { SHOW_DETAILED_MODAL_CONFIGS } from '../../constants';

export const useChangeInstanceModalConfigs = (poLine) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'change-instance-modal-configs' });

  const { isCentralOrderingEnabled } = useCentralOrderingContext();
  const { initPublicationRequest } = usePublishCoordinator();

  const {
    analyzerFactory,
    isLoading: isAnalyzing,
  } = useHoldingsAbandonmentAnalyzer();

  const createInventoryValue = getCreateInventory(poLine);
  const isDetailed = SHOW_DETAILED_MODAL_CONFIGS[createInventoryValue];

  const results = useQuery({
    queryKey: [namespace, poLine.id],
    queryFn: async ({ signal }) => {
      const options = {
        initPublicationRequest,
        isCentralOrderingEnabled,
        signal,
      };
      const holdingIds = await getHoldingIdsFromPOLines(ky, options)([poLine]);

      const analyzer = await analyzerFactory({ holdingIds, signal });

      return checkRelatedHoldings(
        analyzer,
        HoldingsAbandonmentPOLineStrategy.ACTION_TYPES.CHANGE_INSTANCE,
      )([poLine], holdingIds);
    },
    enabled: isDetailed,
  });

  const isLoading = isAnalyzing || results.isFetching;

  return {
    holdingsConfigs: results.data || {},
    isDetailed,
    isLoading,
  };
};
