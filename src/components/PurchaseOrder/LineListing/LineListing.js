import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import { withRouter } from 'react-router-dom';

import {
  Icon,
  Layout,
  MultiColumnList,
} from '@folio/stripes/components';
import { acqRowFormatter } from '@folio/stripes-acq-components';

const alignRowProps = { alignLastColToEnd: true };

function LineListing({ baseUrl, funds, poLines, history, location }) {
  const onSelectRow = useCallback(
    (e, meta) => {
      history.push({
        pathname: `${baseUrl}/po-line/view/${meta.id}`,
        search: location.search,
      });
    },
    [baseUrl, history, location.search],
  );

  const fundsMap = funds.reduce((acc, fund) => {
    acc[fund.id] = fund.code;

    return acc;
  }, {});
  const resultsFormatter = {
    title: ({ titleOrPackage }) => titleOrPackage || '',
    productId: item => map(get(item, 'details.productIds', []), 'productId').join(', '),
    vendorRefNumber: item => get(item, 'vendorDetail.refNumber', ''),
    fundCode: item => get(item, 'fundDistribution', []).map(fund => fundsMap[fund.fundId]).join(', '),
    arrow: () => <Icon icon="caret-right" />,
  };

  return (
    <>
      <MultiColumnList
        contentData={poLines}
        formatter={resultsFormatter}
        onRowClick={onSelectRow}
        rowFormatter={acqRowFormatter}
        rowProps={alignRowProps}
        sortedColumn="poLineNumber"
        sortDirection="ascending"
        visibleColumns={['poLineNumber', 'title', 'productId', 'vendorRefNumber', 'fundCode', 'arrow']}
        columnMapping={{
          arrow: null,
          poLineNumber: <FormattedMessage id="ui-orders.poLine.number" />,
          title: <FormattedMessage id="ui-orders.lineListing.titleOrPackage" />,
          productId: <FormattedMessage id="ui-orders.lineListing.productId" />,
          vendorRefNumber: <FormattedMessage id="ui-orders.lineListing.vendorRefNumber" />,
          fundCode: <FormattedMessage id="ui-orders.lineListing.fundCode" />,
        }}
      />
      <Layout className="textCentered">
        <Icon icon="end-mark">
          <FormattedMessage id="stripes-components.endOfList" />
        </Icon>
      </Layout>
    </>
  );
}

LineListing.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  poLines: PropTypes.arrayOf(PropTypes.object).isRequired,
};

LineListing.defaultProps = {
  funds: [],
};

export default withRouter(LineListing);
