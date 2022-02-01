export const getExportAccountNumbers = (poLines = []) => {
  const automaticExportLines = poLines.filter(({ automaticExport }) => automaticExport);

  return [...new Set(automaticExportLines.map(line => line.vendorDetail?.vendorAccount).filter(Boolean))];
};
