import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { get } from 'lodash';

import { Callout } from '@folio/stripes/components';
import { stripesConnect, stripesShape } from '@folio/stripes/core';
import { SearchAndSort, makeQueryFunction } from '@folio/stripes/smart-components';
import {
  changeSearchIndex,
  FolioFormattedDate,
  showToast,
} from '@folio/stripes-acq-components';

import packageInfo from '../../package';
import Panes from '../components/Panes';
import { POForm } from '../components/PurchaseOrder';
import { createOrderResource } from '../components/Utils/orderResource';
import {
  LINES_API,
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
  ORDERS_API,
  VENDORS_API,
} from '../components/Utils/api';
import {
  ACQUISITIONS_UNITS,
  ADDRESSES,
  CLOSING_REASONS,
  CONTRIBUTOR_NAME_TYPES,
  CREATE_INVENTORY,
  FUND,
  IDENTIFIER_TYPES,
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER_NUMBER_SETTING,
  APPROVALS_SETTING,
  ORDER_TEMPLATES,
  PREFIXES_SETTING,
  SUFFIXES_SETTING,
  USERS,
} from '../components/Utils/resources';
import OrdersNavigation from '../common/OrdersNavigation';
import {
  getActiveFilters,
  handleFilterChange,
} from '../common/utils';
import { WORKFLOW_STATUS } from '../components/PurchaseOrder/Summary/FieldWorkflowStatus';
import OrdersListFilters from './OrdersListFilters';
import { filterConfig } from './OrdersListFilterConfig';
import { ordersSearchTemplate, searchableIndexes } from './OrdersListSearchConfig';
import { FILTERS } from './constants';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const columnWidths = {
  poNumber: '15%',
  vendorCode: '15%',
  workflowStatus: '10%',
  orderType: '15%',
  lastUpdated: '10%',
  acquisitionsUnit: '20%',
  assignedTo: '15%',
};
const sortableColumns = ['poNumber', 'workflowStatus', 'orderType', 'lastUpdated'];

class OrdersList extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        qindex: '',
        query: '',
        filters: '',
        sort: '-poNumber',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      throwErrors: false,
      path: ORDERS_API,
      records: 'purchaseOrders',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            ordersSearchTemplate,
            {
              lastUpdated: 'metadata.updatedDate',
            },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    users: USERS,
    contributorNameTypes: CONTRIBUTOR_NAME_TYPES,
    fund: FUND,
    materialTypes: MATERIAL_TYPES,
    closingReasons: CLOSING_REASONS,
    orderNumberSetting: ORDER_NUMBER_SETTING,
    approvalsSetting: APPROVALS_SETTING,
    prefixesSetting: PREFIXES_SETTING,
    suffixesSetting: SUFFIXES_SETTING,
    orderTemplates: ORDER_TEMPLATES,
    vendors: {
      type: 'okapi',
      path: VENDORS_API,
      GET: {
        params: {
          query: 'id=="*" sortby name',
        },
      },
      records: 'organizations',
      perRequest: 1000,
    },
    orderNumber: {
      accumulate: true,
      fetch: false,
      path: ORDER_NUMBER_API,
      throwErrors: false,
      clientGeneratePk: false,
      type: 'okapi',
      POST: {
        path: ORDER_NUMBER_VALIDATE_API,
      },
    },
    poLine: {
      accumulate: true,
      fetch: false,
      path: LINES_API,
      perRequest: 1000,
      records: 'poLines',
      throwErrors: false,
      type: 'okapi',
    },
    locations: LOCATIONS,
    identifierTypes: IDENTIFIER_TYPES,
    createInventory: CREATE_INVENTORY,
    addresses: ADDRESSES,
    acqUnits: ACQUISITIONS_UNITS,
  });

  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: stripesShape.isRequired,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    browseOnly: PropTypes.bool,
    onComponentWillUnmount: PropTypes.func,
    disableRecordCreation: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  }

  constructor(props, context) {
    super(props, context);
    this.changeSearchIndex = changeSearchIndex.bind(this);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
  }

  initFilters = () => {
    const { resources, mutator } = this.props;

    if (!resources.query.filters) {
      mutator.query.update({
        filters: `${FILTERS.STATUS}.${WORKFLOW_STATUS.open},${FILTERS.STATUS}.${WORKFLOW_STATUS.pending}`,
      });
    }
  }

  create = async (order) => {
    const { mutator } = this.props;

    try {
      const newOrder = await createOrderResource(order, mutator.records);

      mutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
    } catch (e) {
      this.showToast('ui-orders.errors.noCreatedOrder', 'error');
    }
  }

  renderFilters = (onChange) => {
    const { resources } = this.props;
    const closingReasons = get(resources, 'closingReasons.records', []);
    const users = get(resources, 'users.records', []);
    const vendors = get(resources, 'vendors.records', []);
    const acqUnits = get(resources, 'acqUnits.records', []);

    return resources.query
      ? (
        <OrdersListFilters
          acqUnits={acqUnits}
          activeFilters={this.getActiveFilters()}
          closingReasons={closingReasons}
          init={this.initFilters}
          onChange={onChange}
          queryMutator={this.props.mutator.query}
          users={users}
          vendors={vendors}
        />
      )
      : null;
  };

  renderNavigation = () => (
    <OrdersNavigation
      isOrders
      queryMutator={this.props.mutator.query}
    />
  );

  render() {
    const {
      browseOnly,
      intl: { formatMessage },
      disableRecordCreation,
      mutator,
      onComponentWillUnmount,
      resources,
      showSingleResult,
      stripes: {
        user: {
          user: {
            firstName,
            lastName,
          },
        },
      },
    } = this.props;
    const users = get(resources, 'users.records', []);
    const vendors = get(resources, 'vendors.records', []);
    const acqUnitsMap = get(resources, 'acqUnits.records', [])
      .reduce((acc, unit) => ({ ...acc, [unit.id]: unit.name }), {});

    const resultsFormatter = {
      'poNumber': order => get(order, 'poNumber', ''),
      'vendorCode': order => {
        const vendorId = get(order, 'vendor', '');

        return get(vendors.find(({ id }) => id === vendorId), 'code', '');
      },
      'workflowStatus': order => get(order, 'workflowStatus', ''),
      'orderType': order => get(order, 'orderType', ''),
      'lastUpdated': order => <FolioFormattedDate value={get(order, 'metadata.updatedDate')} />,
      'acquisitionsUnit': order => get(order, 'acqUnitIds', []).map(unitId => acqUnitsMap[unitId] || '').join(', '),
      'assignedTo': order => {
        const assignedToId = get(order, 'assignedTo', '');
        const assignedTo = users.find(d => d.id === assignedToId);

        return assignedTo && assignedTo.personal
          ? `${assignedTo.personal.firstName} ${assignedTo.personal.lastName}`
          : '';
      },
    };

    const newRecordInitialValues = {
      createdByName: `${firstName} ${lastName}` || '',
    };

    const translatedSearchableIndexes = searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-orders.search.${index.label}` });

      return { ...index, label };
    });

    return (
      <div data-test-order-instances>
        <SearchAndSort
          packageInfo={packageInfo}
          objectName="order"
          baseRoute={packageInfo.stripes.route}
          onFilterChange={this.handleFilterChange}
          renderFilters={this.renderFilters}
          renderNavigation={this.renderNavigation}
          searchableIndexes={translatedSearchableIndexes}
          onChangeIndex={this.changeSearchIndex}
          selectedIndex={get(resources.query, 'qindex')}
          visibleColumns={['poNumber', 'vendorCode', 'workflowStatus', 'orderType', 'lastUpdated', 'acquisitionsUnit', 'assignedTo']}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Panes}
          editRecordComponent={POForm}
          onCreate={this.create}
          massageNewRecord={this.massageNewRecord}
          newRecordInitialValues={newRecordInitialValues}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          onComponentWillUnmount={onComponentWillUnmount}
          disableRecordCreation={disableRecordCreation}
          finishedResourceName="perms"
          viewRecordPerms="orders.item.get"
          newRecordPerms="orders.item.post"
          parentResources={resources}
          parentMutator={mutator}
          showSingleResult={showSingleResult}
          browseOnly={browseOnly}
          columnMapping={{
            poNumber: <FormattedMessage id="ui-orders.order.poNumber" />,
            vendorCode: <FormattedMessage id="ui-orders.order.vendorCode" />,
            workflowStatus: <FormattedMessage id="ui-orders.order.workflow_status" />,
            orderType: <FormattedMessage id="ui-orders.order.orderType" />,
            lastUpdated: <FormattedMessage id="ui-orders.order.lastUpdated" />,
            acquisitionsUnit: <FormattedMessage id="ui-orders.order.acquisitionsUnit" />,
            assignedTo: <FormattedMessage id="ui-orders.order.assigned_to" />,
          }}
          detailProps={{ showToast: this.showToast }}
          maxSortKeys={1}
          columnWidths={columnWidths}
          sortableColumns={sortableColumns}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default stripesConnect(injectIntl(OrdersList));
