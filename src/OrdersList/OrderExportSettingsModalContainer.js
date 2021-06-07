import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { fetchAllRecords } from '@folio/stripes-acq-components';

import {
  ORDERS,
  ORDER_LINES,
} from '../components/Utils/resources';
import { fetchExportDataByIds } from '../common/utils';
import ExportSettingsModalContainer from '../common/ExportSettingsModal';

const OrderExportSettingsModalContainer = ({
  ordersQuery,
  onCancel,
  mutator,
}) => {
  const fetchOrdersAndLines = useCallback(async () => {
    const orders = await fetchAllRecords(mutator.exportOrders, ordersQuery);
    const orderIds = orders.map(({ id }) => id);
    const buildLineQuery = (itemsChunk) => {
      const query = itemsChunk
        .map(id => `purchaseOrderId==${id}`)
        .join(' or ');

      return query || '';
    };
    const lines = await fetchExportDataByIds(mutator.exportLines, orderIds, buildLineQuery);

    return ({ lines, orders });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [ordersQuery]);

  return (
    <ExportSettingsModalContainer
      fetchOrdersAndLines={fetchOrdersAndLines}
      onCancel={onCancel}
    />
  );
};

OrderExportSettingsModalContainer.manifest = Object.freeze({
  exportLines: ORDER_LINES,
  exportOrders: {
    ...ORDERS,
    accumulate: true,
    fetch: false,
  },
});

OrderExportSettingsModalContainer.propTypes = {
  ordersQuery: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(OrderExportSettingsModalContainer);
