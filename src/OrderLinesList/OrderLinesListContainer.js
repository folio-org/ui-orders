import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  usePagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  ORDERS,
  ACQUISITIONS_UNITS,
} from '../components/Utils/resources';

import {
  useOrderLines,
} from './hooks';
import {
  fetchLinesOrders,
} from './utils';
import {
  fetchOrderAcqUnits,
} from '../OrdersList/utils';
import OrderLinesList from './OrderLinesList';

const resetData = () => { };

const OrderLinesListContainer = ({ mutator }) => {
  const fetchReferences = useCallback(async (poLines) => {
    const lineOrders = await fetchLinesOrders(mutator.lineOrders, poLines, {});
    const acqUnits = await fetchOrderAcqUnits(mutator.orderAcqUnits, lineOrders, {});

    const ordersMap = lineOrders.reduce((acc, d) => {
      acc[d.id] = d;

      return acc;
    }, {});

    const acqUnitsMap = acqUnits.reduce((acc, unit) => {
      acc[unit.id] = unit;

      return acc;
    }, {});

    return { ordersMap, acqUnitsMap };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { pagination, changePage, refreshPage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const { orderLines, orderLinesCount, isLoading, query } = useOrderLines({ pagination, fetchReferences });

  return (
    <OrderLinesList
      isLoading={isLoading}
      orderLines={orderLines}
      orderLinesCount={orderLinesCount}
      pagination={pagination}
      onNeedMoreData={changePage}
      refreshList={refreshPage}
      resetData={resetData}
      linesQuery={query}
    />
  );
};

OrderLinesListContainer.manifest = Object.freeze({
  lineOrders: {
    ...ORDERS,
    fetch: false,
    accumulate: true,
  },
  orderAcqUnits: {
    ...ACQUISITIONS_UNITS,
    fetch: false,
    accumulate: true,
  },
});

OrderLinesListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLinesListContainer);
