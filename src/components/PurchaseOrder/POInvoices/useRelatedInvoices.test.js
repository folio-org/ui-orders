import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '@folio/stripes-acq-components/test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';
import {
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEARS_API,
  INVOICES_API,
} from '../../Utils/api';
import { useRelatedInvoices } from './useRelatedInvoices';

const fiscalYear = {
  id: 'fiscalYearId',
};
const vendor = {
  id: 'vendorId',
};
const invoice = {
  id: 'invoiceId',
  vendorId: vendor.id,
  fiscalYearId: fiscalYear.id,
};

const resultData = [{
  ...invoice,
  vendor,
  fiscalYear,
}];

const queryClient = new QueryClient();

const kyResponseMap = {
  [INVOICES_API]: { invoices: [invoice] },
  [VENDORS_API]: { organizations: [vendor] },
  [FISCAL_YEARS_API]: { fiscalYears: [fiscalYear] },
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRelatedInvoices', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: (path) => ({
          json: () => kyResponseMap[path],
        }),
      });
  });

  it('should fetch connected to po line invoice lines', async () => {
    const { result, waitFor } = renderHook(() => useRelatedInvoices('orderLineId'), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.orderInvoices).toEqual(resultData);
  });
});
