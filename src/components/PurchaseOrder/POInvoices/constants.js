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
  [COLUMN_INVOICE_DATE]: item => item.invoiceDate,
};
export const VISIBLE_COLUMNS = [
  invoice,
  fiscalYear,
  COLUMN_INVOICE_DATE,
  vendorCode,
  vendorInvoiceNo,
  status,
  expendedAmount,
];

export const COLUMN_MAPPING = {
  [invoice]: <FormattedMessage id="ui-orders.relatedInvoices.invoice" />,
  [fiscalYear]: <FormattedMessage id="ui-orders.relatedInvoices.fiscalYear" />,
  [COLUMN_INVOICE_DATE]: <FormattedMessage id="ui-orders.relatedInvoices.invoiceDate" />,
  [vendorCode]: <FormattedMessage id="ui-orders.relatedInvoices.vendorCode" />,
  [vendorInvoiceNo]: <FormattedMessage id="ui-orders.relatedInvoices.vendorInvoiceNo" />,
  [status]: <FormattedMessage id="ui-orders.relatedInvoices.status" />,
  [expendedAmount]: <FormattedMessage id="ui-orders.relatedInvoices.expendedAmount" />,
};

export const RESULT_FORMATTER = {
  [COLUMN_NAMES.invoice]: item => (
    <Link
      data-test-link-to-invoice
      to={`/invoice/view/${item.id}`}
    >
      {get(item, 'folioInvoiceNo', '')}
    </Link>
  ),
  [COLUMN_NAMES.fiscalYear]: item => item.fiscalYear?.code || <NoValue />,
  [COLUMN_INVOICE_DATE]: item => <FolioFormattedDate value={get(item, 'invoiceDate')} />,
  [COLUMN_NAMES.vendorCode]: item => item.vendor?.code || <NoValue />,
  [COLUMN_NAMES.vendorInvoiceNo]: item => item.vendorInvoiceNo || <NoValue />,
  [COLUMN_NAMES.status]: item => get(item, 'status', ''),
  [COLUMN_NAMES.expendedAmount]: item => (
    <AmountWithCurrencyField
      currency={item.currency}
      amount={get(item, 'total', 0)}
    />
  ),
};
