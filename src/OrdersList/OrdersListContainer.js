import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { getFullName } from '@folio/stripes/util';
import { stripesConnect } from '@folio/stripes/core';
import {
  organizationsManifest,
  useList,
} from '@folio/stripes-acq-components';

import { RESULT_COUNT_INCREMENT } from '../common/constants';
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
import useBuildQuery from './useBuildQuery';

const resetData = () => { };

const OrdersListContainer = ({ mutator, location }) => {
  const [vendorsMap, setVendorsMap] = useState({});
  const [acqUnitsMap, setAcqUnitsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [ordersQuery, setOrdersQuery] = useState();
  const buildQuery = useBuildQuery();

  const loadOrders = useCallback(async (offset) => {
    const query = buildQuery(queryString.parse(location.search));

    setOrdersQuery(query);

    return mutator.ordersListRecords.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadOrdersCB = useCallback((setOrders, ordersResponse) => {
    const fetchVendorsPromise = fetchOrderVendors(
      mutator.orderVendors, ordersResponse.purchaseOrders, vendorsMap,
    );
    const fetchAcqUnitsPromise = fetchOrderAcqUnits(
      mutator.orderAcqUnits, ordersResponse.purchaseOrders, acqUnitsMap,
    );
    const fetchUsersPromise = fetchOrderUsers(mutator.orderUsers, ordersResponse.purchaseOrders, usersMap);

    return Promise.all([fetchVendorsPromise, fetchAcqUnitsPromise, fetchUsersPromise])
      .then(([vendorsResponse, acqUnitsResponse, usersResponse]) => {
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
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acqUnitsMap, usersMap, vendorsMap]);

  const {
    records: orders,
    recordsCount: ordersCount,
    isLoading,
    onNeedMoreData,
    refreshList,
  } = useList(false, loadOrders, loadOrdersCB, RESULT_COUNT_INCREMENT);

  return (
    <OrdersList
      ordersCount={ordersCount}
      isLoading={isLoading}
      onNeedMoreData={onNeedMoreData}
      orders={orders}
      refreshList={refreshList}
      resetData={resetData}
      ordersQuery={ordersQuery}
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
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrdersListContainer));
