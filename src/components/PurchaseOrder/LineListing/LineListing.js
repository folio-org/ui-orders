import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

class LineListing extends Component {
  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    poLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    queryMutator: PropTypes.object,
    funds: PropTypes.arrayOf(PropTypes.object),
  };

  onSelectRow = (e, meta) => {
    const { baseUrl, queryMutator } = this.props;
    const _path = `${baseUrl}/po-line/view/${meta.id}`;

    queryMutator.update({ _path });
  };

  render() {
    const { funds, poLines } = this.props;
    const fundsMap = funds.reduce((acc, fund) => {
      acc[fund.id] = fund.code;

      return acc;
    }, {});
    const resultsFormatter = {
      'poLineNumber': ({ poLineNumber }) => poLineNumber,
      'title': ({ title }) => title || '',
      'productId': item => map(get(item, 'details.productIds', []), 'productId').join(', '),
      'vendorRefNumber': item => get(item, 'vendorDetail.refNumber', ''),
      'fundCode': item => get(item, 'fundDistribution', []).map(fund => fundsMap[fund.fundId]).join(', '),
    };

    return (
      <div>
        <MultiColumnList
          contentData={poLines}
          formatter={resultsFormatter}
          onRowClick={this.onSelectRow}
          sortedColumn="poLineNumber"
          sortDirection="ascending"
          visibleColumns={['poLineNumber', 'title', 'productId', 'vendorRefNumber', 'fundCode']}
          columnMapping={{
            poLineNumber: <FormattedMessage id="ui-orders.poLine.number" />,
            title: <FormattedMessage id="ui-orders.lineListing.title" />,
            productId: <FormattedMessage id="ui-orders.lineListing.productId" />,
            vendorRefNumber: <FormattedMessage id="ui-orders.lineListing.vendorRefNumber" />,
            fundCode: <FormattedMessage id="ui-orders.lineListing.fundCode" />,
          }}
        />
      </div>
    );
  }
}

LineListing.defaultProps = {
  funds: [],
};

export default LineListing;
