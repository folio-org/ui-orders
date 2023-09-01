import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  LOCATIONS_API,
  MATERIAL_TYPE_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';
import {
  orderLineAuditEvent,
  vendor as vendorMock,
} from '@folio/stripes-acq-components/test/jest/fixtures';

import {
  location,
  materialType,
  order,
} from 'fixtures';
import {
  useAcqMethods,
  useOrder,
  useOrderLine,
} from '../../../../common/hooks';
import { useSelectedPOLineVersion } from './useSelectedPOLineVersion';

jest.mock('../../../../common/hooks', () => ({
  ...jest.requireActual('../../../../common/hooks'),
  useAcqMethods: jest.fn(() => ({ isLoading: false, orderLine: {} })),
  useOrder: jest.fn(() => ({ isLoading: false, order: {} })),
  useOrderLine: jest.fn(() => ({ isLoading: false, acqMethods: [] })),
}));

const orderLine = {
  ...orderLineAuditEvent.orderLineSnapshot,
};

const vendor = {
  ...vendorMock,
  accounts: [{
    accountNo: '1234',
  }],
};

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const result = {};

      if (url.startsWith(VENDORS_API)) {
        result.organizations = [vendor];
      }
      if (url.startsWith(MATERIAL_TYPE_API)) {
        result.mtypes = [materialType];
      }
      if (url.startsWith(LOCATIONS_API)) {
        result.locations = [location];
      }

      return Promise.resolve({
        isLoading: false,
        ...result,
      });
    },
  })),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useSelectedPOLineVersion', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useAcqMethods.mockClear().mockReturnValue({
      isLoading: false,
      acqMethods: [{
        id: orderLine.acquisitionMethod,
        value: 'Purchase',
      }],
    });
    useOrder.mockClear().mockReturnValue({ isLoading: false, order: { ...order, vendor: vendor.id } });
    useOrderLine.mockClear().mockReturnValue({ isLoading: false, orderLine });
  });

  it('should return PO Line version data', async () => {
    const { result } = renderHook(() => useSelectedPOLineVersion({
      versionId: orderLineAuditEvent.id,
      versions: [{
        ...orderLineAuditEvent,
        orderLineSnapshot: {
          ...orderLineAuditEvent.orderLineSnapshot,
          accessProvider: vendor.id,
        },
      }],
      snapshotPath: 'orderLineSnapshot',
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    const {
      accessProvider,
      acquisitionMethod,
      id,
      locationsList,
      physical,
    } = result.current.selectedVersion;

    expect(id).toEqual(orderLine.id);
    expect(locationsList[0]).toEqual(location);
    expect(physical.materialType).toEqual('stripes-acq-components.versionHistory.deletedRecord');
    expect(physical.materialSupplier).toEqual('stripes-acq-components.versionHistory.deletedRecord');
    expect(accessProvider).toEqual(vendor.name);
    expect(acquisitionMethod).toEqual('Purchase');
  });
});
