import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from '../../../../test/jest/fixtures';
import { TITLES_API } from '../../constants';
import { useTitleMutation } from './useTitleMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const title = {
  id: 'titleId',
  poLineId: orderLine.id,
  isAcknowledged: false,
};
const putMock = jest.fn();

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTitleMutation', () => {
  beforeEach(() => {
    putMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({ titles: [title] }),
        }),
        put: putMock,
      });
  });

  it('should fetch title and update it', async () => {
    const { result, waitFor } = renderHook(() => useTitleMutation(), { wrapper });

    await result.current.mutateTitle(orderLine.id);

    await waitFor(() => !result.current.isLoading);

    expect(putMock).toHaveBeenCalledWith(`${TITLES_API}/${title.id}`, { 'json': { ...title, isAcknowledged: true } });
  });

  it('should not update title ', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ titles: [] }),
      }),
    });

    const { result, waitFor } = renderHook(() => useTitleMutation(), { wrapper });

    await result.current.mutateTitle(orderLine.id);

    await waitFor(() => !result.current.isLoading);

    expect(putMock).not.toHaveBeenCalled();
  });
});
