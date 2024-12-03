import { useQuery } from 'react-query';
import { keyBy } from 'lodash';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  VENDORS_API,
  batchRequest,
} from '@folio/stripes-acq-components';

import { FISCAL_YEARS_API, INVOICES_API } from '../../Utils/api';

export const useRelatedInvoices = (invoiceIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'related-invoices' });

  const { isLoading, data = [] } = useQuery(
    [namespace, ...invoiceIds],
    async ({ signal }) => {
      const invoices = await batchRequest(
        async ({ params: searchParams }) => {
          const invoicesData = await ky.get(INVOICES_API, { searchParams, signal }).json();

          return invoicesData.invoices;
        },
        invoiceIds,
      );

      const vendorIds = invoices.map(({ vendorId }) => vendorId);
      const vendors = await batchRequest(
        async ({ params: searchParams }) => {
          const vendorsData = await ky.get(VENDORS_API, { searchParams, signal }).json();

          return vendorsData.organizations;
        },
        vendorIds,
      );
      const vendorsMap = keyBy(vendors, 'id');

      const fiscalYearIds = invoices.map(({ fiscalYearId }) => fiscalYearId);
      const fiscalYears = await batchRequest(
        async ({ params: searchParams }) => {
          const fiscalYearData = await ky.get(FISCAL_YEARS_API, { searchParams, signal }).json();

          return fiscalYearData.fiscalYears;
        },
        fiscalYearIds,
      );
      const fiscalYearsMap = keyBy(fiscalYears, 'id');

      const result = invoices.map(invoice => {
        const vendor = vendorsMap[invoice.vendorId];
        const fiscalYear = fiscalYearsMap[invoice.fiscalYearId];

        return {
          ...invoice,
          vendor,
          fiscalYear,
        };
      });

      return result;
    },
    { enabled: Boolean(invoiceIds.length) },
  );

  return {
    isLoading,
    orderInvoices: data,
  };
};
