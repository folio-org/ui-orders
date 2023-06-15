import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  find,
  get,
} from 'lodash';

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

const COLUMN_INVOICE_DATE = 'invoiceDate';
const visibleColumns = ['invoice', COLUMN_INVOICE_DATE, 'vendorName', 'vendorInvoiceNo', 'status', 'expendedAmount'];
const columnMapping = {
  invoice: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-orders.relatedInvoices.vendorName" />,
  vendorInvoiceNo: <FormattedMessage id="ui-orders.relatedInvoices.vendorInvoiceNo" />,
  status: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  expendedAmount: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
};
const sorters = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};

const POInvoices = ({ orderInvoices, vendors }) => {
  const { paginatedData, pagination, setPagination } = useLocalPagination(orderInvoices, RESULT_COUNT_INCREMENT);

  if (!orderInvoices || !vendors) {
    return null;
  }

  const resultFormatter = {
    invoice: invoice => (
      <Link
        data-test-link-to-invoice
        to={`/invoice/view/${invoice.id}`}
      >
        {get(invoice, 'folioInvoiceNo', '')}
      </Link>
    ),
    [COLUMN_INVOICE_DATE]: invoice => <FolioFormattedDate value={get(invoice, 'invoiceDate')} />,
    vendorName: invoice => get(find(vendors, ['id', get(invoice, 'vendorId', '')]), 'name', ''),
    vendorInvoiceNo: invoice => invoice.vendorInvoiceNo || <NoValue />,
    status: invoice => get(invoice, 'status', ''),
    expendedAmount: invoice => (
      <AmountWithCurrencyField
        currency={invoice.currency}
        amount={get(invoice, 'total', 0)}
      />
    ),
  };

  return (
    <>
      <FrontendSortingMCL
        columnMapping={columnMapping}
        contentData={paginatedData}
        formatter={resultFormatter}
        id="orderInvoices"
        interactive={false}
        sortDirection={DESC_DIRECTION}
        sortedColumn={COLUMN_INVOICE_DATE}
        sorters={sorters}
        visibleColumns={visibleColumns}
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
  vendors: PropTypes.arrayOf(PropTypes.object),
};

export default POInvoices;
