import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { getFullName } from '@folio/stripes/util';
import { stripesConnect } from '@folio/stripes/core';
import {
  getFilterParams,
  makeQueryBuilder,
  useLocationReset,
  organizationsManifest,
} from '@folio/stripes-acq-components';

import {
  ACQUISITIONS_UNITS,
  ORDERS,
  USERS,
} from '../components/Utils/resources';
import OrdersList from './OrdersList';
import {
  fetchOrderAcqUnits,
  fetchOrderUsers,
  fetchOrderVendors,
} from './utils';
import { getKeywordQuery } from './OrdersListSearchConfig';
import { customFilterMap } from './OrdersListFilterConfig';

const RESULT_COUNT_INCREMENT = 30;

const resetData = () => { };

const buildQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return getKeywordQuery(query);
  },
  'sortby poNumber/sort.descending',
  customFilterMap,
);

const OrdersListContainer = ({ history, mutator, location }) => {
  const [orders, setOrders] = useState([]);
  const [vendorsMap, setVendorsMap] = useState({});
  const [acqUnitsMap, setAcqUnitsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [ordersCount, setOrdersCount] = useState(0);
  const [ordersOffset, setOrdersOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async (offset) => {
    setIsLoading(true);
    const queryParams = queryString.parse(location.search);
    const filterParams = getFilterParams(queryParams);
    const hasToCallAPI = Object.keys(filterParams).length > 0;

    const loadRecordsPromise = hasToCallAPI
      ? mutator.ordersListRecords.GET({
        params: {
          limit: RESULT_COUNT_INCREMENT,
          offset,
          query: buildQuery(queryParams),
        },
      })
        .then(ordersResponse => {
          const fetchVendorsPromise = fetchOrderVendors(
            mutator.orderVendors, ordersResponse.purchaseOrders, vendorsMap,
          );
          const fetchAcqUnitsPromise = fetchOrderAcqUnits(
            mutator.orderAcqUnits, ordersResponse.purchaseOrders, acqUnitsMap,
          );
          const fetchUsersPromise = fetchOrderUsers(mutator.orderUsers, ordersResponse.purchaseOrders, usersMap);

          return Promise.all([ordersResponse, fetchVendorsPromise, fetchAcqUnitsPromise, fetchUsersPromise]);
        })
        .then(([ordersResponse, vendorsResponse, acqUnitsResponse, usersResponse]) => {
          if (!offset) setOrdersCount(ordersResponse.totalRecords);
          const newVendorsMap = {
            ...vendorsMap,
            ...vendorsResponse.reduce((acc, vendor) => {
              acc[vendor.id] = vendor;

              return acc;
            }, {}),
          };

          const newAcqUnitsMap = {
            ...acqUnitsMap,
            ...acqUnitsResponse.reduce((acc, unit) => {
              acc[unit.id] = unit;

              return acc;
            }, {}),
          };

          const newUsersMap = {
            ...usersMap,
            ...usersResponse.reduce((acc, user) => {
              acc[user.id] = user;

              return acc;
            }, {}),
          };

          setVendorsMap(newVendorsMap);
          setAcqUnitsMap(newAcqUnitsMap);
          setUsersMap(newUsersMap);
          setOrders((prev) => [
            ...prev,
            ...ordersResponse.purchaseOrders.map(order => ({
              ...order,
              vendorCode: newVendorsMap[order.vendor]?.code,
              acquisitionsUnit: order.acqUnitIds?.map(unitId => newAcqUnitsMap[unitId]?.name).filter(Boolean).join(', '),
              assignedTo: getFullName(newUsersMap[order.assignedTo]),
            })),
          ]);
        })
      : Promise.resolve();

    return loadRecordsPromise.finally(() => setIsLoading(false));
  };

  const onNeedMoreData = () => {
    const newOffset = ordersOffset + RESULT_COUNT_INCREMENT;

    loadOrders(newOffset)
      .then(() => {
        setOrdersOffset(newOffset);
      });
  };

  const refreshList = () => {
    setOrders([]);
    setOrdersOffset(0);
    loadOrders(0);
  };

  useEffect(
    refreshList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );
  useLocationReset(history, location, '/orders', refreshList);

  return (
    <OrdersList
      ordersCount={ordersCount}
      isLoading={isLoading}
      onNeedMoreData={onNeedMoreData}
      orders={orders}
      resetData={resetData}
    />
  );
};

OrdersListContainer.manifest = Object.freeze({
  ordersListRecords: {
    ...ORDERS,
    records: null,
  },
  orderVendors: {
    ...organizationsManifest,
    accumulate: true,
    fetch: false,
  },
  orderAcqUnits: {
    ...ACQUISITIONS_UNITS,
    accumulate: true,
    fetch: false,
  },
  orderUsers: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
});

OrdersListContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrdersListContainer));
