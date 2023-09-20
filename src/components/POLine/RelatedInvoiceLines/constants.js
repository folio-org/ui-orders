/* eslint-disable no-shadow */
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { NoValue } from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

export const COLUMN_NAMES = {
  amount: 'amount',
  comment: 'comment',
  fiscalYear: 'fiscalYear',
  invoiceDate: 'invoiceDate',
  invoiceLine: 'invoiceLine',
  quantity: 'quantity',
  status: 'status',
  subscriptionDescription: 'subscriptionDescription',
  subscriptionEnd: 'subscriptionEnd',
  subscriptionStart: 'subscriptionStart',
  vendorCode: 'vendorCode',
  vendorInvoiceNo: 'vendorInvoiceNo',
};

const {
  amount,
  comment,
  fiscalYear,
  invoiceDate,
  invoiceLine,
  quantity,
  status,
  subscriptionDescription,
  subscriptionEnd,
  subscriptionStart,
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
  invoiceLine,
  fiscalYear,
  invoiceDate,
  vendorCode,
  subscriptionStart,
  subscriptionEnd,
  subscriptionDescription,
  status,
  quantity,
  amount,
  comment,
];

export const COLUMN_MAPPING = {
  invoiceLine: <FormattedMessage id="ui-orders.relatedInvoiceLines.invoiceLine" />,
  fiscalYear: <FormattedMessage id="ui-orders.relatedInvoices.fiscalYear" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoiceLines.invoiceDate" />,
  vendorCode: <FormattedMessage id="ui-orders.relatedInvoiceLines.vendorCode" />,
  vendorInvoiceNo: <FormattedMessage id="ui-orders.relatedInvoiceLines.vendorInvoiceNo" />,
  subscriptionStart: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionStart" />,
  subscriptionEnd: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionEnd" />,
  subscriptionDescription: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionDescription" />,
  status: <FormattedMessage id="ui-orders.relatedInvoiceLines.status" />,
  quantity: <FormattedMessage id="ui-orders.relatedInvoiceLines.quantity" />,
  amount: <FormattedMessage id="ui-orders.relatedInvoiceLines.amount" />,
  comment: <FormattedMessage id="ui-orders.relatedInvoiceLines.comment" />,
};

export const RESULT_FORMATTER = {
  invoiceLine: invoiceLine => (
    <Link
      data-test-link-to-invoice
      to={`/invoice/view/${invoiceLine.invoice?.id}/line/${invoiceLine.id}/view`}
    >
      {`${invoiceLine.invoiceLineNumber}`}
    </Link>
  ),
  fiscalYear: (invoice) => invoice.fiscalYear?.code || <NoValue />,
  [COLUMN_INVOICE_DATE]: invoiceLine => <FolioFormattedDate value={invoiceLine.invoice?.invoiceDate} />,
  vendorCode: (invoice) => invoice.vendor?.code || <NoValue />,
  vendorInvoiceNo: invoiceLine => invoiceLine.invoice?.vendorInvoiceNo || <NoValue />,
  subscriptionStart: (invoiceLine) => <FolioFormattedDate value={invoiceLine.fiscalYear?.periodStart} />,
  subscriptionEnd: (invoiceLine) => <FolioFormattedDate value={invoiceLine.fiscalYear?.periodEnd} />,
  subscriptionDescription: (invoiceLine) => invoiceLine.fiscalYear?.description || <NoValue />,
  status: invoiceLine => <FormattedMessage id={`ui-invoice.invoice.status.${invoiceLine.invoiceLineStatus.toLowerCase()}`} />,
  amount: invoiceLine => (
    <AmountWithCurrencyField
      currency={invoiceLine.invoice?.currency}
      amount={invoiceLine.total}
    />
  ),
};
