import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  VENDORS_API,
  batchRequest,
} from '@folio/stripes-acq-components';

import {
  INVOICES_API,
  INVOICE_LINES_API,
} from '../../../common/constants';
import { FISCAL_YEARS_API } from '../../Utils/api';

const convertToMap = (arr, key = 'id') => arr.reduce((acc, el) => {
  acc[el[key]] = el;

  return acc;
}, {});

export const useConnectedInvoiceLines = (orderLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'connected-invoice-lines' });

  const { isLoading, data = [] } = useQuery(
    [namespace],
    async () => {
      const { invoiceLines = [], totalRecords } = await ky.get(INVOICE_LINES_API, {
        searchParams: {
          query: `poLineId==${orderLineId}`,
          limit: LIMIT_MAX,
        },
      }).json();

      const invoicesIds = invoiceLines.map(({ invoiceId }) => invoiceId);
      const invoices = await batchRequest(
        async ({ params: searchParams }) => {
          const invoicesData = await ky.get(INVOICES_API, { searchParams }).json();

          return invoicesData.invoices;
        },
        invoicesIds,
      );
      const invoicesMap = convertToMap(invoices);

      const vendorIds = invoices.map(({ vendorId }) => vendorId);
      const vendors = await batchRequest(
        async ({ params: searchParams }) => {
          const vendorsData = await ky.get(VENDORS_API, { searchParams }).json();

          return vendorsData.organizations;
        },
        vendorIds,
      );
      const vendorsMap = convertToMap(vendors);

      const fiscalYearIds = [...new Set(invoices.map(({ fiscalYearId }) => fiscalYearId))];
      const fiscalYears = await batchRequest(
        async ({ params: searchParams }) => {
          const fiscalYearData = await ky.get(FISCAL_YEARS_API, { searchParams }).json();

          return fiscalYearData.fiscalYears;
        },
        fiscalYearIds,
      );
      const fiscalYearsMap = convertToMap(fiscalYears, 'id');

      const result = invoiceLines.map(invoiceLine => {
        const invoice = invoicesMap[invoiceLine.invoiceId];
        const vendor = vendorsMap[invoice.vendorId];
        const fiscalYear = fiscalYearsMap[invoice.fiscalYearId];

        return {
          ...invoiceLine,
          invoice,
          vendor,
          fiscalYear,
        };
      });

      return {
        invoiceLines: result,
        totalInvoiceLines: totalRecords,
      };
    },
    { enabled: Boolean(orderLineId) },
  );

  return {
    isLoading,
    invoiceLines: data.invoiceLines,
    totalInvoiceLines: data.totalInvoiceLines,
  };
};
