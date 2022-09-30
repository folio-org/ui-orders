import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useReexport } from './useReexport';
import { orderLine } from '../../../../test/jest/fixtures/orderLine';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const poLines = [
  { ...orderLine, lastEDIExportDate: '2022-90-31T00:00:00.000Z' },
  { ...orderLine, lastEDIExportDate: '2022-90-31T00:00:00.000Z' },
  { ...orderLine },
];

describe('useReexport', () => {
  const kyMock = {
    put: jest.fn(() => ({
      json: () => Promise.resolve(orderLine),
    })),
  };

  beforeEach(() => {
    kyMock.put.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should run PUT requests to reset PO Lines \'lastEDIExportDate\' field', async () => {
    const { result } = renderHook(() => useReexport(), { wrapper });

    await result.current.reExport(poLines);

    expect(kyMock.put).toHaveBeenCalledTimes(
      poLines.filter(({ lastEDIExportDate }) => lastEDIExportDate).length,
    );
  });
});
