import { FormattedMessage } from 'react-intl';

export const COLUMN_INVOICE_DATE = 'invoiceDate';

export const SORTABLE_FIELDS = [COLUMN_INVOICE_DATE];
export const VISIBLE_COLUMNS = [
  'vendorInvoiceNo',
  'invoice',
  'fiscalYear',
  COLUMN_INVOICE_DATE,
  'vendorCode',
  'subscriptionStart',
  'subscriptionEnd',
  'subscriptionDescription',
  'status',
  'expendedAmount',
];

export const COLUMN_MAPPING = {
  vendorInvoiceNo: <FormattedMessage id="ui-orders.relatedInvoices.vendorInvoiceNo" />,
  invoice: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  fiscalYear: <FormattedMessage id="ui-orders.relatedInvoices.fiscalYear" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  vendorCode: <FormattedMessage id="ui-orders.relatedInvoices.vendorCode" />,
  subscriptionStart: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionStart" />,
  subscriptionEnd: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionEnd" />,
  subscriptionDescription: <FormattedMessage id="ui-orders.relatedInvoices.subscriptionDescription" />,
  status: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  expendedAmount: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
};
