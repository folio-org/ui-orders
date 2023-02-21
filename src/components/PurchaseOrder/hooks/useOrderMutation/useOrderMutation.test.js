import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

import { order } from '../../../../../test/jest/fixtures';
import { WORKFLOW_STATUS } from '../../../../common/constants';
import { useOrderMutation } from './useOrderMutation';

const kyMock = {
  post: jest.fn(() => ({
    json: () => Promise.resolve(),
  })),
  put: jest.fn(() => ({
    json: () => Promise.resolve(),
  })),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderMutation', () => {
  beforeEach(() => {
    kyMock.put.mockClear();
    kyMock.post.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should update purchase order', async () => {
    const { result } = renderHook(() => useOrderMutation(), { wrapper });

    const changedData = { workflowStatus: WORKFLOW_STATUS.open };

    await result.current.updateOrder({ order, changedData });

    expect(kyMock.put).toHaveBeenCalledWith(
      `${ORDERS_API}/${order.id}`,
      expect.objectContaining({
        json: expect.objectContaining(changedData),
      }),
    );
  });
});
