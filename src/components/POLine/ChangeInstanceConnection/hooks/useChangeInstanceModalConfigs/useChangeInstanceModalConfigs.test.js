import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from 'fixtures/orderLine';
import { checkRelatedHoldings } from '../../../../../common/utils';
import { getCreateInventory } from '../../../utils';
import { SHOW_DETAILED_MODAL_CONFIGS } from '../../constants';
import { useChangeInstanceModalConfigs } from './useChangeInstanceModalConfigs';

jest.mock('../../../../../common/utils/checkRelatedHoldings');

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

const kyMock = {
  get: jest.fn(() => ({})),
  extend: jest.fn(() => kyMock),
};

describe('useChangeInstanceModalConfigs', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    checkRelatedHoldings
      .mockClear()
      .mockReturnValue(() => modalConfigs.holdingsConfigs);
  });

  it('should return modal configs', async () => {
    const { result } = renderHook(() => useChangeInstanceModalConfigs(orderLine), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining(modalConfigs));
  });
});
