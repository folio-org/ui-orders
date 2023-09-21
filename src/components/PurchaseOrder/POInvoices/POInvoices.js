import React from 'react';
import PropTypes from 'prop-types';

import {
  FrontendSortingMCL,
  DESC_DIRECTION,
  RESULT_COUNT_INCREMENT,
  useLocalPagination,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import {
  COLUMN_INVOICE_DATE,
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
  RESULT_FORMATTER,
  SORTABLE_COLUMNS,
} from './constants';

const POInvoices = ({ orderInvoices }) => {
  const { paginatedData, pagination, setPagination } = useLocalPagination(orderInvoices, RESULT_COUNT_INCREMENT);

  if (!orderInvoices) {
    return null;
  }

  return (
    <>
      <FrontendSortingMCL
        columnMapping={COLUMN_MAPPING}
        contentData={paginatedData}
        formatter={RESULT_FORMATTER}
        id="orderInvoices"
        interactive={false}
        sortDirection={DESC_DIRECTION}
        sortedColumn={COLUMN_INVOICE_DATE}
        sorters={SORTABLE_COLUMNS}
        visibleColumns={VISIBLE_COLUMNS}
        columnIdPrefix="invoices"
        hasPagination
      />
      {orderInvoices?.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={orderInvoices.length}
          onChange={setPagination}
          disabled={false}
        />
      )}
    </>
  );
};

POInvoices.propTypes = {
  orderInvoices: PropTypes.arrayOf(PropTypes.object),
};

export default POInvoices;
