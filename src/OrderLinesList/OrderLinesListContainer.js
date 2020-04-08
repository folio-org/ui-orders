import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import {
  fundsManifest,
  getFilterParams,
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
  useLocationReset,
} from '@folio/stripes-acq-components';

import {
  IDENTIFIER_TYPES,
  ORDER_LINES,
} from '../components/Utils/resources';
import { QUALIFIER_SEPARATOR } from '../common/constants';
import OrderLinesList from './OrderLinesList';
import {
  buildOrderLinesQuery,
  fetchOrderLinesFunds,
} from './utils';

const RESULT_COUNT_INCREMENT = 30;

const resetData = () => { };

const OrderLinesListContainer = ({ history, mutator, location }) => {
  const [orderLines, setOrderLines] = useState([]);
  const [fundsMap, setFundsMap] = useState({});
  const [orderLinesCount, setOrderLinesCount] = useState(0);
  const [orderLinesOffset, setOrderLinesOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isbnId, setIsbnId] = useState();

  const loadOrderLines = async (offset) => {
    setIsLoading(true);
    const queryParams = queryString.parse(location.search);
    const filterParams = getFilterParams(queryParams);
    let hasToCallAPI = Object.keys(filterParams).length > 0;
    const isISBNSearch = queryParams[SEARCH_INDEX_PARAMETER] === 'productIdISBN';
    let normalizedISBN = null;
    let typeISBNId = isbnId;

    if (isISBNSearch && hasToCallAPI) {
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
        .then(orderLinesResponse => {
          const fetchFundsPromise = fetchOrderLinesFunds(
            mutator.orderLinesFunds, orderLinesResponse.poLines, fundsMap,
          );

          return Promise.all([orderLinesResponse, fetchFundsPromise]);
        })
        .then(([orderLinesResponse, fundsResponse]) => {
          if (!offset) setOrderLinesCount(orderLinesResponse.totalRecords);

          const newFundsMap = {
            ...fundsMap,
            ...fundsResponse.reduce((acc, fund) => {
              acc[fund.id] = fund;

              return acc;
            }, {}),
          };

          setFundsMap(newFundsMap);
          setOrderLines((prev) => [
            ...prev,
            ...orderLinesResponse.poLines.map(orderLine => ({
              ...orderLine,
              funCodes: orderLine.fundDistribution?.map(fund => fundsMap[fund.fundId]?.code).filter(Boolean).join(', '),
            })),
          ]);
        })
      : Promise.resolve();

    return loadRecordsPromise.finally(() => setIsLoading(false));
  };

  const onNeedMoreData = () => {
    const newOffset = orderLinesOffset + RESULT_COUNT_INCREMENT;

    loadOrderLines(newOffset)
      .then(() => {
        setOrderLinesOffset(newOffset);
      });
  };

  const refreshList = () => {
    setOrderLines([]);
    setOrderLinesOffset(0);
    loadOrderLines(0);
  };

  useEffect(
    refreshList,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );
  useLocationReset(history, location, '/orders/lines', refreshList);

  return (
    <OrderLinesList
      orderLinesCount={orderLinesCount}
      isLoading={isLoading}
      onNeedMoreData={onNeedMoreData}
      orderLines={orderLines}
      resetData={resetData}
    />
  );
};

OrderLinesListContainer.manifest = Object.freeze({
  orderLinesListRecords: {
    ...ORDER_LINES,
    records: null,
  },
  orderLinesFunds: {
    ...fundsManifest,
    accumulate: true,
    fetch: false,
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
});

OrderLinesListContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrderLinesListContainer));
