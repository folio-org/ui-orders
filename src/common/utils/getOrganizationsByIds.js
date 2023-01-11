import {
  fetchExportDataByIds,
  VENDORS_API,
} from '@folio/stripes-acq-components';

export const getOrganizationsByIds = (ky) => async (organizationIds) => {
  return fetchExportDataByIds({
    api: VENDORS_API,
    ids: organizationIds,
    ky,
    records: 'organizations',
  });
};
