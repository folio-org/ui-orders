import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  usePagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  ORDERS,
} from '../components/Utils/resources';

import {
  useOrderLines,
} from './hooks';
import {
  fetchLinesOrders,
} from './utils';
import OrderLinesList from './OrderLinesList';

const resetData = () => { };

const OrderLinesListContainer = ({ mutator }) => {
  const fetchReferences = (poLines) => {
    return fetchLinesOrders(mutator.lineOrders, poLines, {})
      .then((ordersResponse) => {
        const ordersMap = ordersResponse.reduce((acc, d) => {
          acc[d.id] = d;

          return acc;
        }, {});

        return { ordersMap };
      });
  };

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
});

OrderLinesListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLinesListContainer);
