import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from 'fixtures';
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
    const { result } = renderHook(() => useTitleMutation(), { wrapper });

    await result.current.mutateTitle(orderLine.id);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(`${TITLES_API}/${title.id}`, { 'json': { ...title, isAcknowledged: true } });
  });

  it('should not update title ', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({ titles: [] }),
      }),
    });

    const { result } = renderHook(() => useTitleMutation(), { wrapper });

    await result.current.mutateTitle(orderLine.id);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).not.toHaveBeenCalled();
  });
});
