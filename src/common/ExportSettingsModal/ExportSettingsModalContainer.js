import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { exportCsv } from '@folio/stripes/util';
import {
  acqUnitsManifest,
  contributorNameTypesManifest,
  expenseClassesManifest,
  identifierTypesManifest,
  locationsManifest,
  materialTypesManifest,
  organizationsManifest,
  usersManifest,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ADDRESSES } from '../../components/Utils/resources';
import { getExportData } from './utils';
import ExportSettingsModal from './ExportSettingsModal';

const ExportSettingsModalContainer = ({
  onCancel,
  mutator,
  fetchOrdersAndLines,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const showCallout = useShowCallout();
  const intl = useIntl();

  const onExportCSV = useCallback(async () => {
    try {
      setIsExporting(true);

      const { lines, orders } = await fetchOrdersAndLines();

      const exportData = await getExportData(mutator, lines, orders, intl);

      setIsExporting(false);

      return exportCsv(exportData, {});
    } catch {
      return showCallout({
        messageId: 'ui-orders.exportSettings.load.error',
        type: 'error',
      });
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fetchOrdersAndLines, showCallout]);

  return (
    <ExportSettingsModal
      isExporting={isExporting}
      onExportCSV={onExportCSV}
      onCancel={onCancel}
    />
  );
};

ExportSettingsModalContainer.manifest = Object.freeze({
  exportVendors: {
    ...organizationsManifest,
    fetch: false,
    accumulate: true,
  },
  exportUsers: {
    ...usersManifest,
    fetch: false,
    accumulate: true,
  },
  exportAddresses: {
    ...ADDRESSES,
    fetch: false,
    accumulate: true,
  },
  exportAcqUnits: {
    ...acqUnitsManifest,
    fetch: false,
    accumulate: true,
  },
  exportContributorNameTypes: {
    ...contributorNameTypesManifest,
    fetch: false,
    accumulate: true,
  },
  exportExpenseClasses: {
    ...expenseClassesManifest,
    fetch: false,
    accumulate: true,
  },
  exportIdentifierTypes: {
    ...identifierTypesManifest,
    fetch: false,
    accumulate: true,
  },
  exportLocations: {
    ...locationsManifest,
    fetch: false,
  },
  exportMaterialTypes: {
    ...materialTypesManifest,
    fetch: false,
  },
});

ExportSettingsModalContainer.propTypes = {
  fetchOrdersAndLines: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ExportSettingsModalContainer);
