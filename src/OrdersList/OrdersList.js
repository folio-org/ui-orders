import React, { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
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

import { WORKFLOW_STATUS_LABELS } from '../common/constants';
import OrdersNavigation from '../common/OrdersNavigation';
import OrdersListFiltersContainer from './OrdersListFiltersContainer';
import Panes from '../components/Panes';
import { searchableIndexes } from './OrdersListSearchConfig';
import OrdersListLastMenu from './OrdersListLastMenu';

const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orders" />;
const visibleColumns = ['poNumber', 'vendorCode', 'workflowStatus', 'orderType', UPDATED_DATE, 'acquisitionsUnit', 'assignedTo'];
const sortableColumns = ['poNumber', 'workflowStatus', 'orderType', UPDATED_DATE];
const resultsFormatter = {
  [UPDATED_DATE]: order => <FolioFormattedDate value={order.metadata?.updatedDate} />,
  workflowStatus: order => WORKFLOW_STATUS_LABELS[order.workflowStatus],
};

export const columnMapping = {
  poNumber: <FormattedMessage id="ui-orders.order.poNumber" />,
  vendorCode: <FormattedMessage id="ui-orders.order.vendorCode" />,
  workflowStatus: <FormattedMessage id="ui-orders.order.workflow_status" />,
  orderType: <FormattedMessage id="ui-orders.order.orderType" />,
  [UPDATED_DATE]: <FormattedMessage id="ui-orders.order.lastUpdated" />,
  acquisitionsUnit: <FormattedMessage id="ui-orders.order.acquisitionsUnit" />,
  assignedTo: <FormattedMessage id="ui-orders.order.assigned_to" />,
};

function OrdersList({
  history,
  isLoading,
  location,
  onNeedMoreData,
  orders,
  ordersCount,
  resetData,
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
  const selectOrder = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/orders/view/${id}`,
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
  const renderLastMenu = useCallback(() => <OrdersListLastMenu search={location.search} />, [location.search]);

  return (
    <Paneset data-test-order-instances>
      {isFiltersOpened && (
        <FiltersPane>
          <OrdersNavigation isOrders />
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
            reset={resetFilters}
            disabled={!location.search}
          />

          <OrdersListFiltersContainer
            activeFilters={filters}
            applyFilters={applyFilters}
          />
        </FiltersPane>
      )}

      <ResultsPane
        count={ordersCount}
        renderLastMenu={renderLastMenu}
        title={title}
        toggleFiltersPane={toggleFilters}
      >
        <MultiColumnList
          autosize
          columnMapping={columnMapping}
          contentData={orders}
          formatter={resultsFormatter}
          hasMargin
          id="orders-list"
          isEmptyMessage={resultsStatusMessage}
          loading={isLoading}
          onHeaderClick={changeSorting}
          onNeedMoreData={onNeedMoreData}
          onRowClick={selectOrder}
          pagingType="click"
          sortDirection={sortingDirection}
          sortOrder={sortingField}
          totalCount={ordersCount}
          virtualize
          visibleColumns={visibleColumns}
        />
      </ResultsPane>

      <Route
        path="/orders/view/:id"
        component={Panes}
      />
    </Paneset>
  );
}

OrdersList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  ordersCount: PropTypes.number,
  isLoading: PropTypes.bool,
  orders: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

OrdersList.defaultProps = {
  ordersCount: 0,
  isLoading: false,
  orders: [],
};

export default withRouter(OrdersList);
