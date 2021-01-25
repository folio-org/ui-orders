export const getExportFieldsOptions = (intl, exportFields) => (
  Object.keys(exportFields).map(fieldName => ({
    label: intl.formatMessage({ id: `ui-orders.exportSettings.fields.${fieldName}` }),
    value: fieldName,
  }))
);
