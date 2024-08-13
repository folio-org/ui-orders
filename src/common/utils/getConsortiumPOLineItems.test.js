import queryString from 'query-string';

import {
  fetchAllRecords,
  ITEMS_API,
} from '@folio/stripes-acq-components';

import { getConsortiumPOLineItems } from './getConsortiumPOLineItems';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchAllRecords: jest.fn(),
}));

const initPublicationRequestMock = jest.fn();

describe('getConsortiumPOLineItems', () => {
  const signal = {};
  const poLine = {
    id: 'poLineId',
    locations: [
      { holdingId: 'hold1', tenantId: 'tenant1' },
      { holdingId: 'hold2', tenantId: 'tenant2' },
    ],
  };

  beforeEach(() => {
    fetchAllRecords
      .mockClear()
      .mockImplementation(async (mutator, query) => {
        expect(mutator).toHaveProperty('GET');
        expect(query).toBe('purchaseOrderLineIdentifier==poLineId');

        const records = await mutator.GET({ params: {
          limit: 100,
          offset: 0,
          query,
        } });

        return records;
      });
    initPublicationRequestMock.mockClear();
  });

  it('should fetch all items related to poLine', async () => {
    initPublicationRequestMock.mockResolvedValue({
      publicationResults: [
        { response: { items: [{ id: 'item1' }, { id: 'item2' }] } },
        { response: { items: [{ id: 'item3' }] } },
      ],
    });

    const items = await getConsortiumPOLineItems(initPublicationRequestMock, { signal })(poLine);

    expect(fetchAllRecords).toHaveBeenCalled();
    expect(initPublicationRequestMock).toHaveBeenCalledTimes(1);

    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(1, {
      url: `${ITEMS_API}?limit=100&offset=0&query=purchaseOrderLineIdentifier==poLineId`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal });

    expect(items).toEqual([{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }]);
  });

  it('should handle empty results', async () => {
    initPublicationRequestMock.mockResolvedValue({
      publicationResults: [{ response: { items: [] } }],
    });

    const items = await getConsortiumPOLineItems(initPublicationRequestMock, { signal })(poLine);

    expect(fetchAllRecords).toHaveBeenCalled();
    expect(initPublicationRequestMock).toHaveBeenCalledTimes(1);

    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(1, {
      url: `${ITEMS_API}?limit=100&offset=0&query=purchaseOrderLineIdentifier==poLineId`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal });

    expect(items).toEqual([]);
  });

  it('should handle multiple tenant results', async () => {
    initPublicationRequestMock.mockResolvedValue({
      publicationResults: [
        { response: { items: [{ id: 'item1' }] } },
      ],
    });

    const items = await getConsortiumPOLineItems(initPublicationRequestMock, { signal })(poLine);

    expect(fetchAllRecords).toHaveBeenCalled();
    expect(initPublicationRequestMock).toHaveBeenCalledTimes(1);

    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(1, {
      url: `${ITEMS_API}?limit=100&offset=0&query=purchaseOrderLineIdentifier==poLineId`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal });

    expect(items).toEqual([{ id: 'item1' }]);
  });
});
