export const formatOpenedFiscalYear = (fiscalYear, emptyLabel) => {
  return fiscalYear
    ? `${fiscalYear.name} (${fiscalYear.code})`
    : emptyLabel;
};
