const automaticExport = 'automaticExport';

const isAcqMethodIncluded = (config, acquisitionMethod) => (
  Boolean(config
    ?.exportTypeSpecificParameters
    ?.vendorEdiOrdersExportConfig
    ?.ediConfig
    ?.defaultAcquisitionMethods
    ?.includes(acquisitionMethod))
);

export const toggleAutomaticExport = ({ vendorAccount, acquisitionMethod, integrationConfigs, change }) => {
  if (vendorAccount) {
    const integrationConfig = integrationConfigs.find(config => (
      config
        ?.exportTypeSpecificParameters
        ?.vendorEdiOrdersExportConfig
        ?.ediConfig
        ?.accountNoList
        ?.includes(vendorAccount)
    ));

    return integrationConfig
      ? change(automaticExport, isAcqMethodIncluded(integrationConfig, acquisitionMethod))
      : change(automaticExport, false);
  } else {
    const defaultIntegrationConfig = integrationConfigs.find(config => (
      config
        ?.exportTypeSpecificParameters
        ?.vendorEdiOrdersExportConfig
        ?.isDefaultConfig
    ));

    return defaultIntegrationConfig
      ? change(automaticExport, isAcqMethodIncluded(defaultIntegrationConfig, acquisitionMethod))
      : change(automaticExport, false);
  }
};
