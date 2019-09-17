import React, { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect, stripesShape } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import { SearchAndSort, makeQueryFunction } from '@folio/stripes/smart-components';
import {
  changeSearchIndex,
  FolioFormattedDate,
  showToast,
} from '@folio/stripes-acq-components';

import packageInfo from '../../package';
import OrdersNavigation from '../common/OrdersNavigation';
import {
  ORDER_LINES_ROUTE,
  LINES_API,
} from '../common/constants';
import {
  getActiveFilters,
  handleFilterChange,
} from '../common/utils';
import {
  CONTRIBUTOR_NAME_TYPES,
  FUND,
  IDENTIFIER_TYPES,
  LOCATIONS,
  MATERIAL_TYPES,
  VENDORS,
} from '../components/Utils/resources';
import OrderLinesFilters from './OrderLinesFilters';
import Details from './Details';
import { filterConfig } from './OrdersLinesFilterConfig';
import { searchableIndexes, queryTemplate } from './OrdersLinesSearchConfig';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const title = <FormattedMessage id="ui-orders.navigation.orderLines" />;
const visibleColumns = ['poLineNumber', 'updatedDate', 'title', 'productIds', 'vendorRefNumber', 'funCodes'];
const sortableColumns = ['poLineNumber', 'updatedDate', 'title', 'vendorRefNumber'];
const resultsFormatter = {
  updatedDate: line => <FolioFormattedDate value={get(line, 'metadata.updatedDate')} />,
  productIds: line => get(line, 'details.productIds', []).map(product => product.productId).join(', '),
  vendorRefNumber: line => get(line, 'vendorDetail.refNumber', ''),
};
const columnWidths = {
  poLineNumber: '9%',
  updatedDate: '9%',
  title: '32%',
  productIds: '18%',
  vendorRefNumber: '14%',
  funCodes: '18%',
};

export const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-orders.orderLineList.poLineNumber" />,
  updatedDate: <FormattedMessage id="ui-orders.orderLineList.updatedDate" />,
  title: <FormattedMessage id="ui-orders.orderLineList.title" />,
  productIds: <FormattedMessage id="ui-orders.orderLineList.productIds" />,
  vendorRefNumber: <FormattedMessage id="ui-orders.orderLineList.vendorRefNumber" />,
  funCodes: <FormattedMessage id="ui-orders.orderLineList.funCodes" />,
};

export class OrderLinesList extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        qindex: '',
        query: '',
        filters: '',
        sort: 'poLineNumber',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      throwErrors: false,
      path: LINES_API,
      records: 'poLines',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            queryTemplate,
            {
              updatedDate: 'metadata.updatedDate',
              vendorRefNumber: 'vendorDetail.refNumber',
            },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    locations: LOCATIONS,
    materialTypes: MATERIAL_TYPES,
    vendors: VENDORS,
    funds: FUND,
    identifierTypes: IDENTIFIER_TYPES,
    contributorNameTypes: CONTRIBUTOR_NAME_TYPES,
  });

  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: stripesShape.isRequired,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    onComponentWillUnmount: PropTypes.func,
    intl: intlShape.isRequired,
  }

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  }

  constructor(props, context) {
    super(props, context);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
    this.callout = React.createRef();
    this.showToast = showToast.bind(this);
    this.renderFilters = this.renderFilters.bind(this);
    this.changeSearchIndex = changeSearchIndex.bind(this);
  }

  renderNavigation = () => (
    <OrdersNavigation
      isOrderLines
      queryMutator={this.props.mutator.query}
    />
  );

  renderFilters(onChange) {
    const { resources } = this.props;
    const locations = get(resources, 'locations.records', []);
    const vendors = get(resources, 'vendors.records', []);
    const materialTypes = get(resources, 'materialTypes.records', []);
    const funds = get(resources, 'funds.records', []);

    return (
      <OrderLinesFilters
        activeFilters={this.getActiveFilters()}
        funds={funds}
        locations={locations}
        materialTypes={materialTypes}
        onChange={onChange}
        queryMutator={this.props.mutator.query}
        vendors={vendors}
      />
    );
  }

  getTranslateSearchableIndexes() {
    const { intl: { formatMessage } } = this.props;

    return searchableIndexes.map(index => {
      const label = formatMessage({ id: `ui-orders.search.${index.label}` });

      return { ...index, label };
    });
  }

  getResultsFormatter() {
    const { resources } = this.props;
    const fundsMap = get(resources, 'funds.records', []).reduce((acc, fund) => {
      acc[fund.id] = fund.code;

      return acc;
    }, {});

    return {
      ...resultsFormatter,
      funCodes: line => get(line, 'fundDistribution', []).map(fund => fundsMap[fund.fundId]).join(', '),
    };
  }

  render() {
    const {
      browseOnly,
      mutator,
      onComponentWillUnmount,
      resources,
      showSingleResult,
      stripes,
    } = this.props;

    const correctPackageInfo = {
      ...packageInfo,
      stripes: {
        ...packageInfo.stripes,
        route: ORDER_LINES_ROUTE,
      },
    };

    return (
      <div data-test-order-line-instances>
        <SearchAndSort
          packageInfo={correctPackageInfo}
          objectName="order-line"
          baseRoute={ORDER_LINES_ROUTE}
          title={title}
          visibleColumns={visibleColumns}
          resultsFormatter={this.getResultsFormatter()}
          columnMapping={columnMapping}
          columnWidths={columnWidths}
          massageNewRecord={this.massageNewRecord}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          onComponentWillUnmount={onComponentWillUnmount}
          disableRecordCreation
          finishedResourceName="perms"
          viewRecordPerms="orders.po-lines.item.get"
          newRecordPerms="orders.po-lines.item.post"
          parentResources={resources}
          parentMutator={mutator}
          stripes={stripes}
          showSingleResult={showSingleResult}
          browseOnly={browseOnly}
          viewRecordComponent={Details}
          renderFilters={this.renderFilters}
          renderNavigation={this.renderNavigation}
          onFilterChange={this.handleFilterChange}
          searchableIndexes={this.getTranslateSearchableIndexes()}
          onChangeIndex={this.changeSearchIndex}
          maxSortKeys={1}
          sortableColumns={sortableColumns}
          selectedIndex={get(resources.query, 'qindex')}
          detailProps={{ showToast: this.showToast }}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default stripesConnect(injectIntl(OrderLinesList));
