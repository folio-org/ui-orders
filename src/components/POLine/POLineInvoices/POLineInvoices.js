import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  find,
  get,
  sum,
} from 'lodash';

import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  FrontendSortingMCL,
  DESC_DIRECTION,
} from '@folio/stripes-acq-components';

const COLUMN_INVOICE_DATE = 'invoiceDate';
const visibleColumns = ['invoice', COLUMN_INVOICE_DATE, 'vendorName', 'status', 'quantity', 'expendedAmount', 'pieces'];
const columnMapping = {
  invoice: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-orders.relatedInvoices.vendorName" />,
  status: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  quantity: <FormattedMessage id="ui-orders.relatedInvoices.quantity" />,
  expendedAmount: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
  pieces: <FormattedMessage id="ui-orders.relatedInvoices.pieces" />,
};
const sorters = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};

const POLineInvoices = ({ lineInvoices, invoiceLines, vendors, pieces }) => {
  if (!(lineInvoices && invoiceLines && vendors && pieces)) {
    return null;
  }

  const captionsList = pieces.map(item => item.caption).join(', ');
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
    status: invoice => get(invoice, 'status', ''),
    quantity: (invoice) => sum(invoiceLines.filter(invoiceLine => invoiceLine.invoiceId === invoice.id).map(inv => get(inv, 'quantity', 0))),
    expendedAmount: invoice => (
      <AmountWithCurrencyField
        currency={invoice.currency}
        amount={get(invoice, 'total', 0)}
      />
    ),
    pieces: () => captionsList,
  };

  return (
    <FrontendSortingMCL
      columnMapping={columnMapping}
      contentData={lineInvoices}
      formatter={resultFormatter}
      id="lineInvoices"
      interactive={false}
      sortDirection={DESC_DIRECTION}
      sortedColumn={COLUMN_INVOICE_DATE}
      sorters={sorters}
      visibleColumns={visibleColumns}
    />
  );
};

POLineInvoices.propTypes = {
  lineInvoices: PropTypes.arrayOf(PropTypes.object),
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  vendors: PropTypes.arrayOf(PropTypes.object),
  pieces: PropTypes.arrayOf(PropTypes.object),
};

export default POLineInvoices;
