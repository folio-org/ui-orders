import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../common/constants';
import { useRoutingListMutation } from './useRoutingListMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const deleteMock = jest.fn();
const putMock = jest.fn();
const postMock = jest.fn();

const values = {
  id: 'test',
  name: 'test',
  userIds: ['test'],
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRoutingListMutation', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        delete: deleteMock,
        put: putMock,
        post: postMock,
      });
  });

  it('should call `createListing` mutation', async () => {
    const { result } = renderHook(() => useRoutingListMutation(), { wrapper });

    await result.current.createListing(values);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(postMock).toHaveBeenCalledWith(ROUTING_LIST_API, expect.objectContaining({}));
  });

  it('should call `updateListing` mutation', async () => {
    const { result } = renderHook(() => useRoutingListMutation(), { wrapper });

    await result.current.updateListing(values);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(`${ROUTING_LIST_API}/${values.id}`, expect.objectContaining({
      json: values,
    }));
  });

  it('should call `deleteListing` mutation', async () => {
    const { result } = renderHook(() => useRoutingListMutation(), { wrapper });

    await result.current.deleteListing(values.id);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(deleteMock).toHaveBeenCalledWith(`${ROUTING_LIST_API}/${values.id}`);
  });
});
