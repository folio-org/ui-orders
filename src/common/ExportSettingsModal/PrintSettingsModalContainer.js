import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import { getExportData, exportManifest } from './utils';
import ExportSettingsModal from './ExportSettingsModal';

const PrintSettingsModalContainer = ({
  mutator,
  onCancel,
  printOrder,
  orderToPrint,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const showCallout = useShowCallout();
  const intl = useIntl();

  const onPrint = useCallback(async (exportFields) => {
    try {
      setIsExporting(true);

      const { compositePoLines } = orderToPrint;
      const exportData = await getExportData(mutator, compositePoLines, [orderToPrint], intl);

      setIsExporting(false);

      onCancel();
      printOrder({
        ...orderToPrint,
        exportData,
      }, exportFields);

      return;
    } catch {
      onCancel();

      showCallout({
        messageId: 'ui-orders.exportSettings.load.error',
        type: 'error',
      });
    }
  },
  [orderToPrint, onCancel, printOrder, showCallout]);

  return (
    <ExportSettingsModal
      isExporting={isExporting}
      onExportCSV={onPrint}
      onCancel={onCancel}
    />
  );
};

PrintSettingsModalContainer.manifest = exportManifest;

PrintSettingsModalContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  orderToPrint: PropTypes.object.isRequired,
  printOrder: PropTypes.func.isRequired,
};

export default stripesConnect(PrintSettingsModalContainer);
