export const ORDERS_ROUTE = '/orders';
export const ORDER_VIEW_ROUTE = `${ORDERS_ROUTE}/view/:id`;
export const ORDER_VIEW_VERSIONS_ROUTE = `${ORDER_VIEW_ROUTE}/versions/:versionId?`;
export const ORDER_LINES_ROUTE = `${ORDERS_ROUTE}/lines`;
export const ORDER_LINE_CREATE_ROUTE = `${ORDER_VIEW_ROUTE}/po-line/create`;
export const ORDER_LINE_EDIT_ROUTE = `${ORDER_VIEW_ROUTE}/po-line/edit/:lineId`;
export const ORDER_LINE_VIEW_ROUTE = `${ORDER_VIEW_ROUTE}/po-line/view/:lineId`;
export const ORDER_LINE_VIEW_VERSIONS_ROUTE = `${ORDER_LINE_VIEW_ROUTE}/versions/:versionId?`;
export const ORDER_CREATE_ROUTE = `${ORDERS_ROUTE}/create`;
export const ORDER_EDIT_ROUTE = `${ORDERS_ROUTE}/edit/:id`;
export const NOTES_ROUTE = `${ORDERS_ROUTE}/notes`;
export const ROUTING_LIST_ROUTE = `${ORDERS_ROUTE}/routing-lists`;

export const EXPORT_MANAGER_ROUTE = '/export-manager';
export const EXPORT_MANAGER_EDI_JOBS_ROUTE = `${EXPORT_MANAGER_ROUTE}/edi-jobs`;
export const INVOICES_ROUTE = '/invoice';
