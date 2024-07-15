import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { usePublishCoordinator } from '@folio/stripes-acq-components';

import { useConsortiumPOLineRelatedItems } from './useConsortiumPOLineRelatedItems';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePublishCoordinator: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const items = [
  {
    id: 'item-1',
    tenantId: 'central',
  },
];

const initPublicationRequestMock = jest.fn(() => {
  return {
    publicationErrors: [],
    publicationResults: [{
      tenantId: 'central',
      response: { items },
    }],
  };
});

describe('useConsortiumPOLineRelatedItems', () => {
  beforeEach(() => {
    initPublicationRequestMock.mockClear();
    usePublishCoordinator
      .mockClear()
      .mockReturnValue({ initPublicationRequest: initPublicationRequestMock });
  });

  it('should fetch PO Line related items in all associated tenants', async () => {
    const poLine = {
      id: 'po-line-id',
      locations: [{ holdingId: 'holdingId', tenantId: 'central' }],
    };

    const { result } = renderHook(() => useConsortiumPOLineRelatedItems(poLine), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.items).toEqual(items);
  });
});
