import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useTitleMutation } from './useTitleMutation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTitleMutation', () => {
  it('should make post request', async () => {
    const postMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useTitleMutation(),
      { wrapper },
    );

    await result.current.mutateTitle({ title: 'title' });

    expect(postMock).toHaveBeenCalled();
  });
});
