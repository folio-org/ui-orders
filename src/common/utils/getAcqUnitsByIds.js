import {
  ACQUISITIONS_UNITS_API,
  fetchExportDataByIds,
} from '@folio/stripes-acq-components';

export const getAcqUnitsByIds = (ky) => async (acquisitionUnitIds) => {
  return fetchExportDataByIds({
    api: ACQUISITIONS_UNITS_API,
    ids: acquisitionUnitIds,
    ky,
    records: 'acquisitionsUnits',
  });
};
