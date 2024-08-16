import queryString from 'query-string';

import {
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { getConsortiumPiecesAndItemsCountByHoldingIds } from './getConsortiumPiecesAndItemsCountByHoldingIds';

const initPublicationRequest = jest.fn();

describe('getConsortiumPiecesAndItemsCountByHoldingIds', () => {
  const poLine = {
    id: 'poLineId',
    locations: [
      { holdingId: 'hold1', tenantId: 'tenant1' },
      { holdingId: 'hold2', tenantId: 'tenant2' },
    ],
  };
  const holdingIds = poLine.locations.map(location => location.holdingId);

  beforeEach(() => {
    initPublicationRequest.mockClear();
  });

  it('should handle successful responses', async () => {
    initPublicationRequest.mockImplementation(({ url }) => {
      if (url.includes(ORDER_PIECES_API)) {
        return Promise.resolve([{ publicationResults: [{ response: { totalRecords: 5 } }], publicationErrors: [] }]);
      }

      if (url.includes(ITEMS_API)) {
        return Promise.resolve([{ publicationResults: [{ response: { totalRecords: 10 } }], publicationErrors: [] }]);
      }

      return Promise.reject(new Error('Unknown API'));
    });

    const result = await getConsortiumPiecesAndItemsCountByHoldingIds(initPublicationRequest)(holdingIds, poLine);

    expect(result).toEqual({
      holdingsPiecesCount: 5,
      holdingsItemsCount: 10,
      errors: {
        pieces: [],
        items: [],
      },
    });
  });

  it('should handle errors in responses', async () => {
    initPublicationRequest.mockImplementation(({ url }) => {
      if (url.includes(ORDER_PIECES_API)) {
        return Promise.resolve([{ publicationResults: [{ response: { totalRecords: 0 } }], publicationErrors: ['Error1'] }]);
      }

      if (url.includes(ITEMS_API)) {
        return Promise.resolve([{ publicationResults: [{ response: { totalRecords: 0 } }], publicationErrors: ['Error2'] }]);
      }

      return Promise.reject(new Error('Test error'));
    });

    const result = await getConsortiumPiecesAndItemsCountByHoldingIds(initPublicationRequest)(holdingIds, poLine);

    expect(result).toEqual({
      holdingsPiecesCount: 0,
      holdingsItemsCount: 0,
      errors: {
        pieces: ['Error1'],
        items: ['Error2'],
      },
    });
  });

  it('should handle mixed successful and error responses', async () => {
    initPublicationRequest.mockImplementation(({ url }) => {
      if (url.includes(ORDER_PIECES_API)) {
        return Promise.resolve([{ publicationResults: [{ response: { totalRecords: 5 } }], publicationErrors: ['Error1'] }]);
      }

      if (url.includes(ITEMS_API)) {
        return Promise.resolve([{ publicationResults: [{ response: { totalRecords: 10 } }], publicationErrors: [] }]);
      }

      return Promise.reject(new Error('Unknown API'));
    });

    const result = await getConsortiumPiecesAndItemsCountByHoldingIds(initPublicationRequest)(holdingIds, poLine);

    expect(result).toEqual({
      holdingsPiecesCount: 5,
      holdingsItemsCount: 10,
      errors: {
        pieces: ['Error1'],
        items: [],
      },
    });
  });

  it('should call initPublicationRequest with correct URL, method, tenants, and signal', async () => {
    initPublicationRequest.mockImplementation(() => {
      return Promise.resolve([{ publicationResults: [], publicationErrors: [] }]);
    });

    const signal = {};
    const tenants = ['tenant1', 'tenant2'];

    await getConsortiumPiecesAndItemsCountByHoldingIds(initPublicationRequest, { signal })(holdingIds, poLine);

    const getOrderPiecesUrl = () => `${ORDER_PIECES_API}?${queryString.stringify({
      query: `holdingId==(${holdingIds.join(' or ')})`,
      limit: 1,
    }, { encode: false })}`;

    const getItemsUrl = () => `${ITEMS_API}?${queryString.stringify({
      query: `holdingsRecordId==(${holdingIds.join(' or ')})`,
      limit: 1,
    }, { encode: false })}`;

    expect(initPublicationRequest).toHaveBeenNthCalledWith(1, {
      url: getOrderPiecesUrl(),
      method: 'GET',
      tenants,
    }, { signal });

    expect(initPublicationRequest).toHaveBeenNthCalledWith(2, {
      url: getItemsUrl(),
      method: 'GET',
      tenants,
    }, { signal });
  });
});
