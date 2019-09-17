import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  find,
  get,
  sum,
} from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

const visibleColumns = ['invoice', 'invoiceDate', 'vendorName', 'status', 'quantity', 'expendedAmount', 'pieces'];
const columnMapping = {
  invoice: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  invoiceDate: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-orders.relatedInvoices.vendorName" />,
  status: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  quantity: <FormattedMessage id="ui-orders.relatedInvoices.quantity" />,
  expendedAmount: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
  pieces: <FormattedMessage id="ui-orders.relatedInvoices.pieces" />,
};
const columnWidths = {
  invoice: '20%',
  invoiceDate: '15%',
  vendorName: '15%',
  status: '10%',
  quantity: '10%',
  expendedAmount: '15%',
  pieces: '15%',
};

const POLineInvoices = ({ lineInvoices, invoiceLines, vendors, pieces }) => {
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
    invoiceDate: invoice => <FolioFormattedDate value={get(invoice, 'invoiceDate')} />,
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
    <MultiColumnList
      contentData={lineInvoices}
      formatter={resultFormatter}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
    />
  );
};

POLineInvoices.propTypes = {
  lineInvoices: PropTypes.arrayOf(PropTypes.object),
  invoiceLines: PropTypes.arrayOf(PropTypes.object),
  vendors: PropTypes.arrayOf(PropTypes.object),
  pieces: PropTypes.arrayOf(PropTypes.object),
};

POLineInvoices.defaultProps = {
  lineInvoices: [],
  invoiceLines: [],
  vendors: [],
  pieces: [],
};

export default POLineInvoices;
