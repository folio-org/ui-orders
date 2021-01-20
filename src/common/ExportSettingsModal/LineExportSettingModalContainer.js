import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { fetchAllRecords } from '@folio/stripes-acq-components';

import {
  ORDERS,
  ORDER_LINES,
} from '../../components/Utils/resources';
import { fetchExportDataByIds } from './utils';
import ExportSettingsModalContainer from './ExportSettingsModalContainer';

const LineExportSettingsModalContainer = ({
  linesQuery,
  onCancel,
  mutator,
}) => {
  const fetchOrdersAndLines = useCallback(async () => {
    try {
      const lines = await fetchAllRecords(mutator.exportLines, linesQuery);
      const orderIds = uniq(lines.map(({ purchaseOrderId }) => purchaseOrderId));
      const orders = await fetchExportDataByIds(mutator.exportOrders, orderIds);

      return ({ lines, orders });
    } catch {
      return onCancel();
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [linesQuery, onCancel]);

  return (
    <ExportSettingsModalContainer
      fetchOrdersAndLines={fetchOrdersAndLines}
      onCancel={onCancel}
    />
  );
};

LineExportSettingsModalContainer.manifest = Object.freeze({
  exportLines: ORDER_LINES,
  exportOrders: {
    ...ORDERS,
    accumulate: true,
    fetch: false,
  },
});

LineExportSettingsModalContainer.propTypes = {
  linesQuery: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(LineExportSettingsModalContainer);
