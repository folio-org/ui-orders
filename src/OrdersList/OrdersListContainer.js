import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import {
  getFullName,
  exportCsv,
} from '@folio/stripes/util';
import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryBuilder,
  organizationsManifest,
  useList,
  fetchAllRecords,
  contributorNameTypesManifest,
  expenseClassesManifest,
  identifierTypesManifest,
  locationsManifest,
  materialTypesManifest,
} from '@folio/stripes-acq-components';

import { RESULT_COUNT_INCREMENT } from '../common/constants';
import {
  fetchExportDataByIds,
  getExportData,
} from '../common/utils';
import {
  ACQUISITIONS_UNITS,
  ADDRESSES,
  ORDERS,
  ORDER_LINES,
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

const resetData = () => { };

const buildQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}==*${query}*)`;
    }

    return getKeywordQuery(query);
  },
  'sortby poNumber/sort.descending',
  customFilterMap,
);

const OrdersListContainer = ({ mutator, location }) => {
  const [vendorsMap, setVendorsMap] = useState({});
  const [acqUnitsMap, setAcqUnitsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const loadOrders = useCallback(async (offset) => {
    return mutator.ordersListRecords.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildQuery(queryString.parse(location.search)),
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

  const onExportCSV = useCallback(async () => {
    setIsExporting(true);
    const ordersQuery = buildQuery(queryString.parse(location.search));
    const orderRecords = await fetchAllRecords(mutator.exportOrders, ordersQuery);
    const orderIds = orderRecords.map(({ id }) => id);
    const buildLineQuery = (itemsChunk) => {
      const query = itemsChunk
        .map(id => `purchaseOrderId==${id}`)
        .join(' or ');

      return query || '';
    };
    const orderLineRecords = await fetchExportDataByIds(mutator.exportLines, orderIds, buildLineQuery);
    const exportData = await getExportData(
      mutator.orderVendors,
      mutator.orderUsers,
      mutator.orderAcqUnits,
      mutator.materialTypes,
      mutator.locations,
      mutator.contributorsNameTypes,
      mutator.identifierTypes,
      mutator.expenseClasses,
      mutator.addresses,
      orderLineRecords,
      orderRecords,
    );

    setIsExporting(false);

    return exportCsv(exportData, {});
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [location.search]);

  return (
    <OrdersList
      ordersCount={ordersCount}
      isLoading={isLoading}
      onNeedMoreData={onNeedMoreData}
      orders={orders}
      refreshList={refreshList}
      resetData={resetData}
      isExporting={isExporting}
      onExportCSV={onExportCSV}
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
  exportOrders: ORDERS,
  exportLines: ORDER_LINES,
  addresses: {
    ...ADDRESSES,
    fetch: false,
    accumulate: true,
  },
  contributorsNameTypes: {
    ...contributorNameTypesManifest,
    fetch: false,
    accumulate: true,
  },
  expenseClasses: {
    ...expenseClassesManifest,
    fetch: false,
    accumulate: true,
  },
  identifierTypes: {
    ...identifierTypesManifest,
    fetch: false,
    accumulate: true,
  },
  locations: {
    ...locationsManifest,
    fetch: false,
  },
  materialTypes: {
    ...materialTypesManifest,
    fetch: false,
  },
});

OrdersListContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrdersListContainer));
