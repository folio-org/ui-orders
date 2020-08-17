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

import { stripesConnect } from '@folio/stripes/core';
import {
  SEARCH_INDEX_PARAMETER,
  SEARCH_PARAMETER,
  useList,
} from '@folio/stripes-acq-components';

import {
  IDENTIFIER_TYPES,
  ORDER_LINES,
} from '../components/Utils/resources';
import { QUALIFIER_SEPARATOR } from '../common/constants';
import OrderLinesList from './OrderLinesList';
import {
  buildOrderLinesQuery,
} from './utils';

const RESULT_COUNT_INCREMENT = 30;

const resetData = () => { };

const OrderLinesListContainer = ({ mutator, location }) => {
  const [isbnId, setIsbnId] = useState();

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
    setOrderLines((prev) => [
      ...prev,
      ...orderLinesResponse.poLines,
    ]);
  }, []);

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
});

OrderLinesListContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrderLinesListContainer));
