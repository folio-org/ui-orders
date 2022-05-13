import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { orderLine } from '../../../../../../test/jest/fixtures/orderLine';
import { getCreateInventory } from '../../../utils';
import { SHOW_DETAILED_MODAL_CONFIGS } from '../../constants';
import { checkRelatedHoldings } from '../../utils';
import { useChangeInstanceModalConfigs } from './useChangeInstanceModalConfigs';

jest.mock('../../utils/checkRelatedHoldings');

const modalConfigs = {
  holdingsConfigs: {
    holdingIds: orderLine.locations.map(({ holdingId }) => holdingId),
    relatedToAnother: false,
    willAbandoned: false,
  },
  isDetailed: SHOW_DETAILED_MODAL_CONFIGS[getCreateInventory(orderLine)],
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useChangeInstanceModalConfigs', () => {
  beforeEach(() => {
    checkRelatedHoldings
      .mockClear()
      .mockReturnValue(() => modalConfigs.holdingsConfigs);
  });

  it('should return modal configs', async () => {
    const { result, waitFor } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual(expect.objectContaining(modalConfigs));
  });
});
