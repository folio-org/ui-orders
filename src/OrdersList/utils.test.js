import { ResponseErrorsContainer } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../common/constants';
import {
  fetchOrderAcqUnits,
  fetchOrderUsers,
  fetchOrderVendors,
  handleOrdersListLoadingError,
} from './utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  ResponseErrorsContainer: {
    create: jest.fn(),
  },
}));

const orders = [
  {
    id: 'orderId1',
    vendor: 'vendorId1',
    acqUnitIds: ['unitId1', 'unitId2'],
    assignedTo: 'userId1',
  },
  {
    id: 'orderId2',
    vendor: 'vendorId2',
    acqUnitIds: ['unitId2', 'unitId3'],
    assignedTo: 'userId2',
  },
];

describe('OrdersList utils', () => {
  describe('fetchOrderVendors', () => {
    const mutator = {
      GET: jest.fn(() => Promise.resolve([])),
    };

    beforeEach(() => {
      mutator.GET.mockClear();
    });

    it('should fetch unfetched vendors', async () => {
      await fetchOrderVendors(mutator, orders, {});

      expect(mutator.GET).toHaveBeenCalled();
    });

    it('should not fetch already fetched vendors', async () => {
      const fetchedVendorsMap = {
        vendorId1: { id: 'vendorId1' },
        vendorId2: { id: 'vendorId2' },
      };

      await fetchOrderVendors(mutator, orders, fetchedVendorsMap);

      expect(mutator.GET).not.toHaveBeenCalled();
    });

    it('should filter out duplicate vendor ids', async () => {
      const duplicateOrders = [
        { vendor: 'vendorId1' },
        { vendor: 'vendorId1' },
      ];

      await fetchOrderVendors(mutator, duplicateOrders, {});

      expect(mutator.GET).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchOrderAcqUnits', () => {
    const mutator = {
      GET: jest.fn(() => Promise.resolve([])),
    };

    beforeEach(() => {
      mutator.GET.mockClear();
    });

    it('should fetch unfetched acquisition units', async () => {
      await fetchOrderAcqUnits(mutator, orders, {});

      expect(mutator.GET).toHaveBeenCalled();
    });

    it('should not fetch already fetched acquisition units', async () => {
      const fetchedAcqUnitsMap = {
        unitId1: { id: 'unitId1' },
        unitId2: { id: 'unitId2' },
        unitId3: { id: 'unitId3' },
      };

      await fetchOrderAcqUnits(mutator, orders, fetchedAcqUnitsMap);

      expect(mutator.GET).not.toHaveBeenCalled();
    });

    it('should handle orders without acqUnitIds', async () => {
      const ordersWithoutAcqUnits = [{ id: 'orderId1' }];

      await fetchOrderAcqUnits(mutator, ordersWithoutAcqUnits, {});

      expect(mutator.GET).not.toHaveBeenCalled();
    });
  });

  describe('fetchOrderUsers', () => {
    const mutator = {
      GET: jest.fn(() => Promise.resolve([])),
    };

    beforeEach(() => {
      mutator.GET.mockClear();
    });

    it('should fetch unfetched users', async () => {
      await fetchOrderUsers(mutator, orders, {});

      expect(mutator.GET).toHaveBeenCalled();
    });

    it('should not fetch already fetched users', async () => {
      const fetchedUsersMap = {
        userId1: { id: 'userId1' },
        userId2: { id: 'userId2' },
      };

      await fetchOrderUsers(mutator, orders, fetchedUsersMap);

      expect(mutator.GET).not.toHaveBeenCalled();
    });

    it('should filter out duplicate user ids', async () => {
      const duplicateOrders = [
        { assignedTo: 'userId1' },
        { assignedTo: 'userId1' },
      ];

      await fetchOrderUsers(mutator, duplicateOrders, {});

      expect(mutator.GET).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleOrdersListLoadingError', () => {
    const callout = {
      sendCallout: jest.fn(),
    };
    const intl = {
      formatMessage: jest.fn((msg) => msg.id),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle request too large error (414)', async () => {
      const error = { response: { status: 414 } };
      const handler = {
        handle: jest.fn(),
      };

      ResponseErrorsContainer.create.mockResolvedValue({ handler });

      await handleOrdersListLoadingError(error, callout, intl);

      expect(ResponseErrorsContainer.create).toHaveBeenCalledWith(error.response);
      expect(handler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          handle: expect.any(Function),
        }),
      );
    });

    it('should handle request too large error (431)', async () => {
      const error = { response: { status: 431 } };
      const handler = {
        handle: jest.fn(),
      };

      ResponseErrorsContainer.create.mockResolvedValue({ handler });

      await handleOrdersListLoadingError(error, callout, intl);

      expect(ResponseErrorsContainer.create).toHaveBeenCalledWith(error.response);
      expect(handler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          handle: expect.any(Function),
        }),
      );
    });

    it('should handle generic errors with default error code', async () => {
      const error = { response: { status: 500 } };
      const handler = {
        handle: jest.fn(),
      };

      ResponseErrorsContainer.create.mockResolvedValue({ handler });

      await handleOrdersListLoadingError(error, callout, intl);

      expect(ResponseErrorsContainer.create).toHaveBeenCalledWith(error.response);
      expect(handler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          handle: expect.any(Function),
        }),
      );
    });

    it('should use ordersNotLoadedGeneric as default error code', async () => {
      const error = { response: { status: 500 } };
      const handler = {
        handle: jest.fn((strategy) => {
          // Call the strategy to verify the error code
          const errorsContainer = {
            getError: () => ({ code: 'genericError' }),
          };

          strategy.handle(errorsContainer);
        }),
      };

      ResponseErrorsContainer.create.mockResolvedValue({ handler });

      await handleOrdersListLoadingError(error, callout, intl);

      expect(intl.formatMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringContaining(ERROR_CODES.ordersNotLoadedGeneric),
        }),
      );
    });
  });
});
