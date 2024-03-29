import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { VENDORS_API } from '@folio/stripes-acq-components';

import {
  INVOICES_API,
  INVOICE_LINES_API,
} from '../../../common/constants';

import { useConnectedInvoiceLines } from './useConnectedInvoiceLines';
import { FISCAL_YEARS_API } from '../../Utils/api';

const vendor = {
  id: 'vendorId',
};
const fiscalYear = {
  id: 'fiscalYearId',
};
const invoice = {
  id: 'invoiceId',
  vendorId: vendor.id,
  fiscalYearId: fiscalYear.id,
};
const invoiceLine = {
  id: 'invoiceLineId',
  invoiceId: invoice.id,
};

const resultData = [{
  ...invoiceLine,
  invoice,
  vendor,
  fiscalYear,
}];

const queryClient = new QueryClient();

const kyResponseMap = {
  [INVOICE_LINES_API]: { invoiceLines: [invoiceLine], totalRecords: 1 },
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

describe('useConnectedInvoiceLines', () => {
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
    const { result } = renderHook(() => useConnectedInvoiceLines('orderLineId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.invoiceLines).toEqual(resultData);
    expect(result.current.totalInvoiceLines).toBe(1);
  });
});
