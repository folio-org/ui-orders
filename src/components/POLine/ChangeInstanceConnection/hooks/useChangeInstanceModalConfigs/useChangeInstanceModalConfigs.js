import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { checkRelatedHoldings } from '../../../../../common/utils';
import { getCreateInventory } from '../../../utils';
import { SHOW_DETAILED_MODAL_CONFIGS } from '../../constants';

export const useChangeInstanceModalConfigs = (poLine) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'change-instance-modal-configs' });

  const createInventoryValue = getCreateInventory(poLine);
  const isDetailed = SHOW_DETAILED_MODAL_CONFIGS[createInventoryValue];

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [namespace, poLine.id],
    queryFn: ({ signal }) => checkRelatedHoldings(ky.extend({ signal }))(poLine),
    queryOptions: {
      enabled: isDetailed,
    },
  });

  return {
    holdingsConfigs: data || {},
    isDetailed,
    isLoading,
  };
};
