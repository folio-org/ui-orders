import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import { withRouter } from 'react-router-dom';

import {
  Icon,
  Layout,
  MultiColumnList,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

import { isOrderLineCancelled } from '../../POLine/utils';
import { LINE_LISTING_COLUMN_MAPPING } from '../constants';

const alignRowProps = { alignLastColToEnd: true };

function LineListing({
  baseUrl,
  funds,
  poLines,
  history,
  location,
  visibleColumns,
}) {
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
    poLineNumber: item => {
      const isCancelled = isOrderLineCancelled(item);

      return !isCancelled ? item.poLineNumber : (
        <>
          {item.poLineNumber}
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
    title: ({ titleOrPackage }) => titleOrPackage || '',
    productId: item => map(get(item, 'details.productIds', []), 'productId').join(', '),
    estimatedPrice: item => (
      <AmountWithCurrencyField
        currency={item.cost?.currency}
        amount={item.cost?.poLineEstimatedPrice}
      />
    ),
    vendorRefNumber: item => (
      item.vendorDetail?.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
    ),
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
        visibleColumns={visibleColumns}
        columnMapping={LINE_LISTING_COLUMN_MAPPING}
        columnIdPrefix="po-lines"
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
  poLines: PropTypes.arrayOf(PropTypes.object),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

LineListing.defaultProps = {
  funds: [],
  poLines: [],
};

export default withRouter(LineListing);
