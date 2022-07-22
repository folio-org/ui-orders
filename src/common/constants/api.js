import {
  LINES_API,
  ORDERS_API,
} from '@folio/stripes-acq-components';

export const INSTANCE_STATUSES_API = 'instance-statuses';
export const INSTANCE_TYPES_API = 'instance-types';
export const REASONS_FOR_CLOSURE_API = 'orders/configuration/reasons-for-closure';
export const UPDATE_ENCUMBRANCES_API = `${ORDERS_API}/:{id}/re-encumber`;

export const INVOICES_API = 'invoice/invoices';
export const INVOICE_LINES_API = 'invoice/invoice-lines';

export const TITLES_API = 'orders/titles';

export const VALIDATE_PO_LINE_FUND_DISTRIBUTION_API = `${LINES_API}/fund-distributions/validate`;
