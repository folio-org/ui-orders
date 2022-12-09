import React, { useCallback, useState } from 'react';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Route,
  Switch,
  useParams,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Icon,
  MultiColumnList,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';
import {
  ColumnManagerMenu,
  PersistedPaneset,
  useColumnManager,
} from '@folio/stripes/smart-components';
import {
  FiltersPane,
  FolioFormattedDate,
  NoResultsMessage,
  ORDER_STATUS_LABEL,
  PrevNextPagination,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useFiltersReset,
  useFiltersToogle,
  useLocalStorageFilters,
  useLocationSorting,
  useModalToggle,
  useItemToView,
  VersionHistoryPane,
} from '@folio/stripes-acq-components';
import { searchableIndexes } from '@folio/plugin-find-po-line';

// TODO: remove during UIOR-1036
import { orderLineAuditEvent } from '@folio/stripes-acq-components/test/jest/fixtures';

import OrdersNavigation from '../common/OrdersNavigation';
import { ORDER_LINES_ROUTE } from '../common/constants';
import {
  getPoLineFieldsLabelMap,
  isOrderLineCancelled,
} from '../components/POLine/utils';
import OrderLinesFiltersContainer from './OrderLinesFiltersContainer';
import Details from './Details';
import OrderLinesListActionMenu from './OrderLinesListActionMenu';
import LineExportSettingsModalContainer from './LineExportSettingModalContainer';

// TODO: remove during UIOR-1036
const mockSnapshot = { ...orderLineAuditEvent.orderLineSnapshot };
const mockVersions = [
  {
    ...orderLineAuditEvent,
    id: 'qwerty12345',
    userId: '3c963ca5-7575-4c2a-8a15-a6598db734ba',
    eventDate: '2022-11-10T10:19:53.804Z',
    orderLineSnapshot: { ...mockSnapshot,
      contributors: [...mockSnapshot.contributors, { name: '2' }],
      publicationDate: '1998',
      claims: [
        {
          claimed: false,
          grace: 0,
        },
      ] },
  },
  {
    ...orderLineAuditEvent,
    id: 'qwerty1234',
    userId: '6c963ca5-7575-4c2a-8a15-a6598db734ba',
    eventDate: '2022-11-10T10:18:53.804Z',
    orderLineSnapshot: { ...mockSnapshot, poLineDescription: 'Test desc' },
  },
  {
    ...orderLineAuditEvent,
    id: 'qwerty123',
    eventDate: '2022-11-10T10:17:53.804Z',
    orderLineSnapshot: { ...mockSnapshot, details: { ...mockSnapshot.details, productIds: [{ ...mockSnapshot.details.productIds[0], productId: '0747-0089' }] } },
  },
  { ...orderLineAuditEvent, id: 'qwerty12' },
];

const VENDOR_REF_NUMBER = 'vendorDetail.refNumber';
const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orderLines" />;
const sortableColumns = ['poLineNumber', UPDATED_DATE, 'titleOrPackage'];

export const resultsFormatter = {
  poLineNumber: line => {
    const isCancelled = isOrderLineCancelled(line);

    return !isCancelled ? line.poLineNumber : (
      <>
        {line.poLineNumber}
        &nbsp;
        <Tooltip
          id="cancel-tooltip"
          text={<FormattedMessage id="ui-orders.canceled" />}
        >
          {({ ref, ariaIds }) => (
            <Icon
              data-testid="cancel-icon"
              icon="cancel"
              status="warn"
              ref={ref}
              aria-labelledby={ariaIds.text}
            />
          )}
        </Tooltip>
      </>
    );
  },
  [UPDATED_DATE]: line => <FolioFormattedDate value={get(line, 'metadata.updatedDate')} utc={false} />,
  productIds: line => get(line, 'details.productIds', []).map(product => product.productId).join(', '),
  [VENDOR_REF_NUMBER]: line => (
    line.vendorDetail?.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
  ),
  funCodes: line => line.fundDistribution?.map(({ code }) => code).filter(Boolean).join(', '),
  orderWorkflow: line => ORDER_STATUS_LABEL[line.orderWorkflow],
};

export const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-orders.orderLineList.poLineNumber" />,
  [UPDATED_DATE]: <FormattedMessage id="ui-orders.orderLineList.updatedDate" />,
  titleOrPackage: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
  productIds: <FormattedMessage id="ui-orders.orderLineList.productIds" />,
  [VENDOR_REF_NUMBER]: <FormattedMessage id="ui-orders.orderLineList.vendorRefNumber" />,
  funCodes: <FormattedMessage id="ui-orders.orderLineList.funCodes" />,
  orderWorkflow: <FormattedMessage id="ui-orders.orderLineList.orderWorkflow" />,
  acqUnit: <FormattedMessage id="ui-orders.order.acquisitionsUnit" />,
};

function OrderLinesList({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  orderLines,
  orderLinesCount,
  refreshList,
  linesQuery,
  pagination,
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
  ] = useLocalStorageFilters('OrderLinesList/filters', location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableColumns);
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-orders/order-lines/filters');
  const [isExportModalOpened, toggleExportModal] = useModalToggle();
  const selectOrderLine = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/orders/lines/view/${id}`,
        search: location.search,
      });
    },
    [history, location.search],
  );
  const { visibleColumns, toggleColumn } = useColumnManager('order-lines-column-manager', columnMapping);
  const { itemToView, setItemToView, deleteItemToView } = useItemToView('order-lines-list');

  useFiltersReset(resetFilters);

  // TODO: move logic to the VersionView component (UIOR-1036)
  const { versionId } = useParams();
  const [currentVersion, setCurrentVersion] = useState(versionId || mockVersions[0].id);

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const onVersionsClose = useCallback((id) => () => history.push({
    pathname: `${ORDER_LINES_ROUTE}/view/${id}`,
    search: location.search,
  }), [history, location.search]);

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <>
        <OrderLinesListActionMenu
          orderLinesCount={orderLinesCount}
          onToggle={onToggle}
          toggleExportModal={toggleExportModal}
        />
        <ColumnManagerMenu
          prefix="order-lines"
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </>
    ),
    [orderLinesCount, toggleExportModal, visibleColumns, toggleColumn],
  );

  const renderLineDetails = useCallback((props) => (
    <Details
      {...props}
      refreshList={refreshList}
    />
  ), [refreshList]);

  // TODO: replace this render with POLineVersionView component after its implementation (UIOR-1036)
  const renderLineVersionHistory = useCallback((props) => (
    <>
      <Details
        {...props}
        refreshList={refreshList}
      />
      <VersionHistoryPane
        id="order-line"
        // eslint-disable-next-line react/prop-types
        onClose={onVersionsClose(props.match.params.id)}
        onSelectVersion={setCurrentVersion}
        currentVersion={currentVersion}
        snapshotPath="orderLineSnapshot"
        labelsMap={getPoLineFieldsLabelMap({})}
        versions={mockVersions}
      />
    </>
  ), [currentVersion, onVersionsClose, refreshList]);

  return (
    <PersistedPaneset
      appId="ui-orders"
      id="order-lines"
      data-test-order-line-instances
    >
      {isFiltersOpened && (
        <FiltersPane
          id="order-lines-filters-pane"
          toggleFilters={toggleFilters}
        >
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
            reset={resetFilters}
            disabled={!location.search || isLoading}
          />

          <OrderLinesFiltersContainer
            activeFilters={filters}
            applyFilters={applyFilters}
            disabled={isLoading}
          />
        </FiltersPane>
      )}

      <ResultsPane
        id="order-lines-results-pane"
        autosize
        count={orderLinesCount}
        renderActionMenu={renderActionMenu}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        title={title}
        toggleFiltersPane={toggleFilters}
        isLoading={isLoading}
      >
        {({ height, width }) => (
          <>
            <MultiColumnList
              columnMapping={columnMapping}
              contentData={orderLines}
              formatter={resultsFormatter}
              hasMargin
              id="order-line-list"
              isEmptyMessage={resultsStatusMessage}
              loading={isLoading}
              onHeaderClick={changeSorting}
              onNeedMoreData={onNeedMoreData}
              onRowClick={selectOrderLine}
              pagingType="none"
              sortDirection={sortingDirection}
              sortOrder={sortingField}
              totalCount={orderLines.length}
              visibleColumns={visibleColumns}
              height={height - PrevNextPagination.HEIGHT}
              width={width}
              onMarkPosition={setItemToView}
              onMarkReset={deleteItemToView}
              itemToView={itemToView}
            />

            {orderLines.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={orderLinesCount}
                disabled={isLoading}
                onChange={onNeedMoreData}
              />
            )}
          </>
        )}
      </ResultsPane>

      {isExportModalOpened && (
        <LineExportSettingsModalContainer
          onCancel={toggleExportModal}
          linesQuery={linesQuery}
        />
      )}

      <Switch>
        <Route
          exact
          path="/orders/lines/view/:id"
          render={renderLineDetails}
        />

        <Route
          exact
          path="/orders/lines/view/:id/versions/:versionId?"
          render={renderLineVersionHistory}
        />
      </Switch>
    </PersistedPaneset>
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
  refreshList: PropTypes.func.isRequired,
  linesQuery: PropTypes.string,
  pagination: PropTypes.object,
};

OrderLinesList.defaultProps = {
  orderLinesCount: 0,
  isLoading: false,
  orderLines: [],
  linesQuery: '',
};

export default withRouter(OrderLinesList);
