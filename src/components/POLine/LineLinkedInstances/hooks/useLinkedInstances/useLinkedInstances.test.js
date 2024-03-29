import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useLinkedInstances } from './useLinkedInstances';

jest.mock('./formatters', () => ({
  formatContributors: jest.fn().mockReturnValue('formattedContributors'),
  formatPublishers: jest.fn().mockReturnValue('formattedPublishers'),
  formatRelations: jest.fn().mockReturnValue('formattedRelations'),
}));

const linkedInstance = {
  id: 'instanceId',
  title: 'ABA instance',
};
const linkedTitles = [{ instanceId: linkedInstance.id }];
const formattedLinkedInstance = {
  id: linkedInstance.id,
  title: linkedInstance.title,
  contributors: 'formattedContributors',
  publishers: 'formattedPublishers',
  relations: 'formattedRelations',
  receivingTitle: linkedTitles[0],
};
const queryClient = new QueryClient();

const kyResponseMap = {
  'instance-relationship-types': [],
  'inventory/instances': { instances: [linkedInstance] },
  'orders/titles': { titles: linkedTitles },
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLinkedInstances', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => kyResponseMap[path],
        }),
      });
  });

  it('should fetch package POL linked instances', async () => {
    const pol = { id: 'line1', isPackage: true };

    const { result } = renderHook(() => useLinkedInstances(pol), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.linkedInstances).toEqual(linkedTitles.map(() => formattedLinkedInstance));
  });
});
