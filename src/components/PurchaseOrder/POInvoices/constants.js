/* eslint-disable no-shadow */
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { NoValue } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

export const COLUMN_NAMES = {
  expendedAmount: 'expendedAmount',
  fiscalYear: 'fiscalYear',
  invoice: 'invoice',
  invoiceDate: 'invoiceDate',
  status: 'status',
  vendorCode: 'vendorCode',
  vendorInvoiceNo: 'vendorInvoiceNo',
};

const {
  expendedAmount,
  fiscalYear,
  invoice,
  invoiceDate,
  status,
  vendorCode,
  vendorInvoiceNo,
} = COLUMN_NAMES;

export const COLUMN_INVOICE_DATE = invoiceDate;
export const SORTABLE_FIELDS = [COLUMN_INVOICE_DATE];
export const SORTABLE_COLUMNS = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};
export const VISIBLE_COLUMNS = [
  vendorInvoiceNo,
  invoice,
  fiscalYear,
  COLUMN_INVOICE_DATE,
  vendorCode,
  status,
  expendedAmount,
];

export const COLUMN_MAPPING = {
  [vendorInvoiceNo]: <FormattedMessage id="ui-orders.relatedInvoices.vendorInvoiceNo" />,
  [invoice]: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  [fiscalYear]: <FormattedMessage id="ui-orders.relatedInvoices.fiscalYear" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  [vendorCode]: <FormattedMessage id="ui-orders.relatedInvoices.vendorCode" />,
  [status]: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  [expendedAmount]: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
};

export const COLUMN_SORTERS = {
  [COLUMN_INVOICE_DATE]: ({ invoiceDate }) => invoiceDate,
};

export const RESULT_FORMATTER = {
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
  [COLUMN_NAMES.status]: (invoice) => get(invoice, 'status', ''),
  [COLUMN_NAMES.expendedAmount]: (invoice) => (
    <AmountWithCurrencyField
      currency={invoice.currency}
      amount={get(invoice, 'total', 0)}
    />
  ),
};
