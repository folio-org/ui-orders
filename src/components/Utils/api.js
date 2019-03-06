export const ORDERS_API = 'orders/composite-orders';
export const ORDER_DETAIL_API = `${ORDERS_API}/:{id}`;
export const LINES_API = 'orders/order-lines';
export const LINE_DETAIL_API = `${LINES_API}/:{lineId}`;
export const CONFIG_API = 'configurations/entries';
export const ORDER_NUMBER_API = 'orders/po-number';
export const ORDER_NUMBER_VALIDATE_API = `${ORDER_NUMBER_API}/validate`;
export const VENDORS_API = 'vendor-storage/vendors';
export const RECEIVING_API = 'orders/receiving-history';
export const LOCATIONS_API = 'locations';
export const RECEIVE_API = 'orders/receive';
