import {
  CQLBuilder,
  fetchFiscalYearById,
  fetchFiscalYears,
  LIMIT_MAX,
} from '@folio/stripes-acq-components';

export const fetchPaymentTermsFiscalYears = (ky) => (startingFiscalYearId, { signal } = {}) => {
  return fetchFiscalYearById(ky)(startingFiscalYearId, { signal })
    .then((fiscalYear) => {
      const query = new CQLBuilder()
        .equal('series', fiscalYear.series)
        .gte('periodStart', fiscalYear.periodStart)
        .sortBy('periodStart')
        .build();

      return fetchFiscalYears(ky)({
        searchParams: {
          limit: LIMIT_MAX,
          query,
        },
        signal,
      });
    });
};
