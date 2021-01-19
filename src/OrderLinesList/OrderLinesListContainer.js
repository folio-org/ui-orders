import React, {
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';
import { uniq } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { exportCsv } from '@folio/stripes/util';
import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
  useList,
  usersManifest,
  fetchAllRecords,
  acqUnitsManifest,
  contributorNameTypesManifest,
  expenseClassesManifest,
  identifierTypesManifest,
  locationsManifest,
  materialTypesManifest,
} from '@folio/stripes-acq-components';

import {
  fetchExportDataByIds,
  getExportData,
} from '../common/utils';
import {
  IDENTIFIER_TYPES,
  ORDER_LINES,
  ORDERS,
  VENDORS,
  ADDRESSES,
} from '../components/Utils/resources';
import { QUALIFIER_SEPARATOR } from '../common/constants';
import OrderLinesList from './OrderLinesList';
import {
  buildOrderLinesQuery,
  fetchLinesOrders,
} from './utils';

const RESULT_COUNT_INCREMENT = 30;

const resetData = () => { };

const OrderLinesListContainer = ({ mutator, location }) => {
  const [isbnId, setIsbnId] = useState();
  const [ordersMap, setOrdersMap] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const loadOrderLines = useCallback(async (offset, hasFilters) => {
    const queryParams = queryString.parse(location.search);
    let hasToCallAPI = hasFilters;
    const isISBNSearch = queryParams[SEARCH_INDEX_PARAMETER] === 'productIdISBN';
    let normalizedISBN = null;
    let typeISBNId = isbnId;

    if (isISBNSearch && hasFilters) {
      const isbnNumber = queryParams[SEARCH_PARAMETER].split(QUALIFIER_SEPARATOR)[0];

      if (isbnNumber) {
        const path = `isbn/convertTo13?isbn=${isbnNumber}&hyphens=false`;

        try {
          const normalizedInput = await mutator.normalizeISBN.GET({ path });

          normalizedISBN = normalizedInput.isbn;
        } catch (e) {
          hasToCallAPI = false;
        }
      } else {
        hasToCallAPI = false;
      }

      if (!isbnId) {
        const typeISBN = await mutator.identifierTypeISBN.GET();

        typeISBNId = typeISBN[0]?.id;
        setIsbnId(typeISBNId);
        if (!typeISBNId) hasToCallAPI = false;
      }
    }

    const loadRecordsPromise = hasToCallAPI
      ? mutator.orderLinesListRecords.GET({
        params: {
          limit: RESULT_COUNT_INCREMENT,
          offset,
          query: buildOrderLinesQuery(queryParams, typeISBNId, normalizedISBN),
        },
      })
      : Promise.resolve();

    return loadRecordsPromise;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbnId, location.search]);

  const loadOrderLinesCB = useCallback((setOrderLines, orderLinesResponse) => {
    return fetchLinesOrders(mutator.lineOrders, orderLinesResponse.poLines, ordersMap)
      .then((ordersResponse) => {
        const newOrdersMap = {
          ...ordersMap,
          ...ordersResponse.reduce((acc, d) => {
            acc[d.id] = d;

            return acc;
          }, {}),
        };

        setOrdersMap(newOrdersMap);
        setOrderLines((prev) => [
          ...prev,
          ...orderLinesResponse.poLines.map(line => ({
            ...line,
            orderWorkflow: newOrdersMap[line.purchaseOrderId]?.workflowStatus,
          })),
        ]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersMap]);

  const onExportCSV = useCallback(async () => {
    setIsExporting(true);
    const linesQuery = buildOrderLinesQuery(queryString.parse(location.search));
    const orderLineRecords = await fetchAllRecords(mutator.exportLines, linesQuery);
    const orderIds = uniq(orderLineRecords.map(({ purchaseOrderId }) => purchaseOrderId));
    const orderRecords = await fetchExportDataByIds(mutator.lineOrders, orderIds);
    const exportData = await getExportData(
      mutator.vendors,
      mutator.users,
      mutator.acqUnits,
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

  const {
    records: orderLines,
    recordsCount: orderLinesCount,
    isLoading,
    onNeedMoreData,
    refreshList,
  } = useList(false, loadOrderLines, loadOrderLinesCB, RESULT_COUNT_INCREMENT);

  return (
    <OrderLinesList
      orderLinesCount={orderLinesCount}
      isLoading={isLoading}
      onNeedMoreData={onNeedMoreData}
      orderLines={orderLines}
      refreshList={refreshList}
      resetData={resetData}
      isExporting={isExporting}
      onExportCSV={onExportCSV}
    />
  );
};

OrderLinesListContainer.manifest = Object.freeze({
  orderLinesListRecords: {
    ...ORDER_LINES,
    records: null,
  },
  identifierTypeISBN: {
    ...IDENTIFIER_TYPES,
    accumulate: true,
    fetch: false,
    params: {
      query: '(name=="isbn")',
    },
  },
  normalizeISBN: {
    accumulate: true,
    fetch: false,
    type: 'okapi',
    throwErrors: false,
  },
  exportLines: ORDER_LINES,
  lineOrders: {
    ...ORDERS,
    accumulate: true,
    fetch: false,
  },
  vendors: {
    ...VENDORS,
    fetch: false,
    accumulate: true,
  },
  users: {
    ...usersManifest,
    fetch: false,
    accumulate: true,
  },
  addresses: {
    ...ADDRESSES,
    fetch: false,
    accumulate: true,
  },
  acqUnits: {
    ...acqUnitsManifest,
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

OrderLinesListContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrderLinesListContainer));
