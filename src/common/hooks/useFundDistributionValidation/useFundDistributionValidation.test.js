import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { VALIDATE_PO_LINE_FUND_DISTRIBUTION_API } from '../../constants';
import { useFundDistributionValidation } from './useFundDistributionValidation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const cost = {
  currency: 'USD',
  quantityPhysical: 1,
  listUnitPrice: 42,
};
const fundDistribution = [{
  code: 'ASIAHIST',
  value: 50,
  fundId: '55f48dc6-efa7-4cfe-bc7c-4786efe493e3',
  encumbrance: null,
  expenseClassId: null,
  distributionType: 'percentage',
}];
const putMock = jest.fn();

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFundDistributionValidation', () => {
  beforeEach(() => {
    putMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({}),
        }),
        put: putMock,
      });
  });

  it('should fetch title and update it', async () => {
    const { result } = renderHook(() => useFundDistributionValidation({ cost }), { wrapper });

    await result.current.validateFundDistributionTotal({ ...cost, ...fundDistribution });
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(VALIDATE_PO_LINE_FUND_DISTRIBUTION_API, expect.objectContaining({}));
  });
});
