import {
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { getHoldingPiecesAndItemsCount } from './getHoldingPiecesAndItemsCount';

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const responsesMap = {
        [ITEMS_API]: { totalRecords: 3 },
        [ORDER_PIECES_API]: { totalRecords: 2 },
      };

      return Promise.resolve(responsesMap[url] || { totalRecords: 1 });
    },
  })),
};

const initPublicationRequestMock = jest.fn((_request) => {
  return Promise.resolve({
    publicationResults: [{
      response: { totalRecords: 3 },
    }],
  });
});

describe('getHoldingPiecesAndItemsCount', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    initPublicationRequestMock.mockClear();
  });

  it('should return count of pieces and items related to holding', async () => {
    const { piecesCount, itemsCount } = await getHoldingPiecesAndItemsCount(kyMock)('holdingId');

    expect(kyMock.get).toHaveBeenCalled();
    expect(piecesCount).toEqual(2);
    expect(itemsCount).toEqual(3);
  });

  it('should return count of pieces and items related to holding with central ordering enabled', async () => {
    const options = {
      isCentralOrderingEnabled: true,
      initPublicationRequest: initPublicationRequestMock,
      signal: {},
      tenants: [{ id: 'tenant1' }, { id: 'tenant2' }],
    };

    const { piecesCount, itemsCount } = await getHoldingPiecesAndItemsCount(kyMock, options)('holdingId');

    expect(initPublicationRequestMock).toHaveBeenCalledTimes(2);
    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(1, {
      url: `${ORDER_PIECES_API}?query=holdingId==holdingId&limit=1`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal: options.signal });

    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(2, {
      url: `${ITEMS_API}?query=holdingsRecordId==holdingId&limit=1`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal: options.signal });

    expect(piecesCount).toEqual(3);
    expect(itemsCount).toEqual(3);
  });

  it('should return count of pieces and items related to holding with central ordering enabled and handle errors', async () => {
    initPublicationRequestMock.mockImplementationOnce(() => Promise.resolve({
      publicationResults: [{
        response: { totalRecords: 3 },
      }],
    })).mockImplementationOnce(() => Promise.resolve({
      publicationResults: [{
        response: undefined,
      }],
    }));

    const options = {
      isCentralOrderingEnabled: true,
      initPublicationRequest: initPublicationRequestMock,
      signal: {},
      tenants: [{ id: 'tenant1' }, { id: 'tenant2' }],
    };

    const { piecesCount, itemsCount } = await getHoldingPiecesAndItemsCount(kyMock, options)('holdingId');

    expect(initPublicationRequestMock).toHaveBeenCalledTimes(2);
    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(1, {
      url: `${ORDER_PIECES_API}?query=holdingId==holdingId&limit=1`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal: options.signal });

    expect(initPublicationRequestMock).toHaveBeenNthCalledWith(2, {
      url: `${ITEMS_API}?query=holdingsRecordId==holdingId&limit=1`,
      method: 'GET',
      tenants: ['tenant1', 'tenant2'],
    }, { signal: options.signal });

    expect(piecesCount).toEqual(3);
    expect(itemsCount).toEqual(0);
  });
});
