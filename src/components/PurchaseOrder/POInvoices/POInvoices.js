import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { NoValue } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  FrontendSortingMCL,
  DESC_DIRECTION,
  RESULT_COUNT_INCREMENT,
  useLocalPagination,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import {
  COLUMN_INVOICE_DATE,
  COLUMN_MAPPING,
  COLUMN_NAMES,
  VISIBLE_COLUMNS,
} from './constants';

const sorters = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};

const resultFormatter = {
  [COLUMN_NAMES.vendorInvoiceNo]: (invoice) => invoice.vendorInvoiceNo || <NoValue />,
  [COLUMN_NAMES.invoice]: (invoice) => (
    <Link
      data-test-link-to-invoice
      to={`/invoice/view/${invoice.id}`}
    >
      {get(invoice, 'folioInvoiceNo', '')}
    </Link>
  ),
  [COLUMN_NAMES.fiscalYear]: (invoice) => invoice.fiscalYear?.code || <NoValue />,
  [COLUMN_INVOICE_DATE]: (invoice) => <FolioFormattedDate value={get(invoice, 'invoiceDate')} />,
  [COLUMN_NAMES.vendorCode]: (invoice) => invoice.vendor?.code || <NoValue />,
  [COLUMN_NAMES.subscriptionStart]: (invoice) => <FolioFormattedDate value={invoice.fiscalYear?.periodStart} />,
  [COLUMN_NAMES.subscriptionEnd]: (invoice) => <FolioFormattedDate value={invoice.fiscalYear?.periodEnd} />,
  [COLUMN_NAMES.subscriptionDescription]: (invoice) => invoice.fiscalYear?.description || <NoValue />,
  [COLUMN_NAMES.status]: (invoice) => get(invoice, 'status', ''),
  [COLUMN_NAMES.expendedAmount]: (invoice) => (
    <AmountWithCurrencyField
      currency={invoice.currency}
      amount={get(invoice, 'total', 0)}
    />
  ),
};

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
        formatter={resultFormatter}
        id="orderInvoices"
        interactive={false}
        sortDirection={DESC_DIRECTION}
        sortedColumn={COLUMN_INVOICE_DATE}
        sorters={sorters}
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
