import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { orderLine } from '../../../../test/jest/fixtures';
import {
  checkIndependentPOLinesRelatedHoldings,
  checkSynchronizedPOLinesRelatedHoldings,
} from '../../utils';
import { useOrderLinesAbandonedHoldingsCheck } from './useOrderLinesAbandonedHoldingsCheck';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  checkIndependentPOLinesRelatedHoldings: jest.fn(() => () => ({})),
  checkSynchronizedPOLinesRelatedHoldings: jest.fn(() => () => ({})),
}));

const poLines = [orderLine];

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderLinesAbandonedHoldingsCheck', () => {
  beforeEach(() => {
    checkIndependentPOLinesRelatedHoldings
      .mockClear()
      .mockReturnValue(() => ({ willAbandoned: false }));
    checkSynchronizedPOLinesRelatedHoldings
      .mockClear()
      .mockReturnValue(() => ({ willAbandoned: false }));
  });

  it('should', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useOrderLinesAbandonedHoldingsCheck(poLines),
      { wrapper },
    );

    await waitForNextUpdate();

    console.log(result.current);
  });
});
