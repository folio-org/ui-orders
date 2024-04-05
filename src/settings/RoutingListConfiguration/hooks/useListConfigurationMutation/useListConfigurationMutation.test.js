import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { TEMPLATES_API } from '../../../../common/constants/api';
import { LIST_CONFIGURATION_TEMPLATE_ID } from '../../constants';
import { useListConfigurationMutation } from './useListConfigurationMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const putMock = jest.fn();
const postMock = jest.fn();

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useListConfigurationMutation', () => {
  beforeEach(() => {
    putMock.mockClear();
    postMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        put: putMock,
        post: postMock,
      });
  });

  it('should call `createListConfig` mutation', async () => {
    const { result } = renderHook(() => useListConfigurationMutation(), { wrapper });

    await result.current.createListConfig({
      description: 'test',
      localizedTemplates: {
        en: {
          body: 'test',
        },
      },
    });
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(postMock).toHaveBeenCalledWith(TEMPLATES_API, expect.objectContaining({}));
  });

  it('should call `updateListConfig` mutation', async () => {
    const { result } = renderHook(() => useListConfigurationMutation(), { wrapper });

    await result.current.updateListConfig({
      description: 'test',
      localizedTemplates: {
        en: {
          body: 'test',
        },
      },
    });
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(putMock).toHaveBeenCalledWith(`${TEMPLATES_API}/${LIST_CONFIGURATION_TEMPLATE_ID}`, expect.objectContaining({
      json: {
        description: 'test',
        localizedTemplates: {
          en: {
            body: 'test',
          },
        },
      },
    }));
  });
});
