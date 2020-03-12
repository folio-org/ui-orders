import React, { useCallback, useMemo } from 'react';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  MultiColumnList,
  Paneset,
} from '@folio/stripes/components';
import { SearchAndSortNoResultsMessage } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  FolioFormattedDate,
  ResetButton,
  ResultsPane,
  SEARCH_PARAMETER,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import OrdersNavigation from '../common/OrdersNavigation';
import OrderLinesFiltersContainer from './OrderLinesFiltersContainer';
import Details from './Details';
import { searchableIndexes } from './OrdersLinesSearchConfig';

const VENDOR_REF_NUMBER = 'vendorDetail.refNumber';
const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orderLines" />;
const visibleColumns = ['poLineNumber', UPDATED_DATE, 'title', 'productIds', VENDOR_REF_NUMBER, 'funCodes'];
const sortableColumns = ['poLineNumber', UPDATED_DATE, 'title', VENDOR_REF_NUMBER];
const resultsFormatter = {
  [UPDATED_DATE]: line => <FolioFormattedDate value={get(line, 'metadata.updatedDate')} />,
  productIds: line => get(line, 'details.productIds', []).map(product => product.productId).join(', '),
  [VENDOR_REF_NUMBER]: line => get(line, 'vendorDetail.refNumber', ''),
  title: line => get(line, 'titleOrPackage', ''),
};

export const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-orders.orderLineList.poLineNumber" />,
  [UPDATED_DATE]: <FormattedMessage id="ui-orders.orderLineList.updatedDate" />,
  title: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
  productIds: <FormattedMessage id="ui-orders.orderLineList.productIds" />,
  [VENDOR_REF_NUMBER]: <FormattedMessage id="ui-orders.orderLineList.vendorRefNumber" />,
  funCodes: <FormattedMessage id="ui-orders.orderLineList.funCodes" />,
};

function OrderLinesList({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  orderLines,
  orderLinesCount,
}) {
  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableColumns);
  const [isFiltersOpened, toggleFilters] = useToggle(true);
  const selectOrderLine = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/orders/lines/view/${id}`,
        search: location.search,
      });
    },
    [history, location.search],
  );

  const hasFilters = filters && Object.values(filters).some(Boolean);
  const source = useMemo(
    () => ({
      loaded: () => hasFilters && !isLoading,
      pending: () => isLoading,
      failure: () => {},
    }),
    [isLoading, hasFilters],
  );

  const resultsStatusMessage = (
    <SearchAndSortNoResultsMessage
      filterPaneIsVisible={isFiltersOpened}
      searchTerm={filters[SEARCH_PARAMETER] || ''}
      source={source}
      toggleFilterPane={toggleFilters}
    />
  );

  return (
    <Paneset data-test-order-line-instances>
      {isFiltersOpened && (
        <FiltersPane>
          <OrdersNavigation isOrderLines />
          <SingleSearchForm
            applySearch={applySearch}
            changeSearch={changeSearch}
            searchQuery={searchQuery}
            isLoading={isLoading}
            ariaLabelId="ui-orders.search"
            searchableIndexes={searchableIndexes}
            changeSearchIndex={changeIndex}
            selectedIndex={searchIndex}
          />

          <ResetButton
            id="reset-invoice-filters"
            reset={resetFilters}
            disabled={!location.search}
          />

          <OrderLinesFiltersContainer
            activeFilters={filters}
            applyFilters={applyFilters}
          />
        </FiltersPane>
      )}

      <ResultsPane
        count={orderLinesCount}
        title={title}
        toggleFiltersPane={toggleFilters}
      >
        <MultiColumnList
          autosize
          columnMapping={columnMapping}
          contentData={orderLines}
          formatter={resultsFormatter}
          id="order-line-list"
          isEmptyMessage={resultsStatusMessage}
          loading={isLoading}
          onHeaderClick={changeSorting}
          onNeedMoreData={onNeedMoreData}
          onRowClick={selectOrderLine}
          sortDirection={sortingDirection}
          sortOrder={sortingField}
          totalCount={orderLinesCount}
          virtualize
          visibleColumns={visibleColumns}
        />
      </ResultsPane>

      <Route
        path="/orders/lines/view/:id"
        component={Details}
        exact
      />
    </Paneset>
  );
}

OrderLinesList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  orderLinesCount: PropTypes.number,
  isLoading: PropTypes.bool,
  orderLines: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

OrderLinesList.defaultProps = {
  orderLinesCount: 0,
  isLoading: false,
  orderLines: [],
};

export default withRouter(OrderLinesList);
