export const AGREEMENTS_API = 'erm/sas';
export const AGREEMENT_LINES_API = 'erm/entitlements';
export const EXPORT_HISTORY_API = 'orders/export-history';
export const HOLDINGS_API = 'holdings-storage/holdings';
export const INVOICES_API = 'invoice/invoices';
export const INVOICE_LINES_API = 'invoice/invoice-lines';
export const ISBN_CONVERT_TO_13 = 'isbn/convertTo13';
export const ISBN_VALIDATOR = 'isbn/validator';
export const LINES_API = 'orders/order-lines';
export const LINE_DETAIL_API = `${LINES_API}/:{lineId}`;
export const ORDERS_API = 'orders/composite-orders';
export const ORDER_DETAIL_API = `${ORDERS_API}/:{id}`;
export const ORDER_INVOICE_RELNS_API = 'orders-storage/order-invoice-relns';
export const ORDER_NUMBER_API = 'orders/po-number';
export const ORDER_NUMBER_VALIDATE_API = `${ORDER_NUMBER_API}/validate`;
export const ORDER_TEMPLATES_API = 'orders/order-templates';
export const ORDER_TEMPLATE_DETAIL_API = `${ORDER_TEMPLATES_API}/:{id}`;
export const ORGANIZATION_TYPES_API = 'organizations-storage/organization-types';
export const RECEIVING_API = 'orders/receiving-history';
export const FISCAL_YEARS_API = 'finance/fiscal-years';
