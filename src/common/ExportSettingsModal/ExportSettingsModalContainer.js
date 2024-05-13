import moment from 'moment';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import { exportToCsv } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import { useCustomFields } from '@folio/stripes/smart-components';
import {
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  useShowCallout,
} from '@folio/stripes-acq-components';

import ExportSettingsModal from './ExportSettingsModal';
import {
  exportManifest,
  getExportData,
  getExportLineFields,
  getExportOrderFields,
} from './utils';
import {
  ENTITY_TYPE_ORDER,
  ENTITY_TYPE_PO_LINE,
} from '../constants';

const ExportSettingsModalContainer = ({
  onCancel,
  mutator,
  fetchOrdersAndLines,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [customFieldsPO, isLoadingPO] = useCustomFields(CUSTOM_FIELDS_ORDERS_BACKEND_NAME, ENTITY_TYPE_ORDER);
  const [customFieldsPOL, isLoadingPOL] = useCustomFields(CUSTOM_FIELDS_ORDERS_BACKEND_NAME, ENTITY_TYPE_PO_LINE);
  const customFields = useMemo(
    () => [...(customFieldsPO || []), ...(customFieldsPOL || [])],
    [customFieldsPO, customFieldsPOL],
  );
  const isLoadingCustomFields = isLoadingPO || isLoadingPOL;
  const showCallout = useShowCallout();
  const intl = useIntl();

  const onExportCSV = useCallback(async (exportFields) => {
    try {
      setIsExporting(true);
      showCallout({ messageId: 'ui-orders.exportSettings.load.start' });

      const { lines, orders } = await fetchOrdersAndLines();

      const exportData = await getExportData(mutator, lines, orders, customFields, intl);

      setIsExporting(false);

      onCancel();

      const filename = `order-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

      return exportToCsv(
        [{ ...getExportOrderFields(customFields), ...getExportLineFields(customFields) }, ...exportData],
        {
          onlyFields: exportFields,
          header: false,
          filename,
        },
      );
    } catch {
      onCancel();

      return showCallout({
        messageId: 'ui-orders.exportSettings.load.error',
        type: 'error',
      });
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [customFields, fetchOrdersAndLines, showCallout, onCancel]);

  return (
    <ExportSettingsModal
      customFields={customFields}
      isExporting={isExporting}
      isLoading={isLoadingCustomFields}
      onExportCSV={onExportCSV}
      onCancel={onCancel}
    />
  );
};

ExportSettingsModalContainer.manifest = exportManifest;

ExportSettingsModalContainer.propTypes = {
  fetchOrdersAndLines: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ExportSettingsModalContainer);
