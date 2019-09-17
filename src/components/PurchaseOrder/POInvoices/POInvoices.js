import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  find,
  get,
} from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

const visibleColumns = ['invoice', 'invoiceDate', 'vendorName', 'status', 'expendedAmount'];
const columnMapping = {
  invoice: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  invoiceDate: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  vendorName: <FormattedMessage id="ui-orders.relatedInvoices.vendorName" />,
  status: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  expendedAmount: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
};
const columnWidths = {
  invoice: '20%',
  invoiceDate: '15%',
  vendorName: '25%',
  status: '15%',
  expendedAmount: '25%',
};

const POInvoices = ({ orderInvoices, vendors }) => {
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
    expendedAmount: invoice => (
      <AmountWithCurrencyField
        currency={invoice.currency}
        amount={get(invoice, 'total', 0)}
      />
    ),
  };

  return (
    <MultiColumnList
      contentData={orderInvoices}
      formatter={resultFormatter}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={columnWidths}
    />
  );
};

POInvoices.propTypes = {
  orderInvoices: PropTypes.arrayOf(PropTypes.object),
  vendors: PropTypes.arrayOf(PropTypes.object),
};

POInvoices.defaultProps = {
  orderInvoices: [],
  vendors: [],
};

export default POInvoices;
