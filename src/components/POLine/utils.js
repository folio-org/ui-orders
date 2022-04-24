import {
  PAYMENT_STATUS,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusOpen,
} from '../PurchaseOrder/util';

export const isOrderLineCancelled = (line) => (
  line.paymentStatus === PAYMENT_STATUS.cancelled || line.receiptStatus === RECEIPT_STATUS.cancelled
);

export const isCancelableLine = (line, order) => (
  (isWorkflowStatusClosed(order) || isWorkflowStatusOpen(order)) &&
  !(
    (line.receiptStatus === RECEIPT_STATUS.fullyReceived &&
      line.paymentStatus === PAYMENT_STATUS.fullyPaid) ||
    (line.receiptStatus === RECEIPT_STATUS.receiptNotRequired &&
      line.paymentStatus === PAYMENT_STATUS.paymentNotRequired) ||
    (line.receiptStatus === RECEIPT_STATUS.cancelled &&
      line.paymentStatus === PAYMENT_STATUS.cancelled)
  )
);

export const setPaymentStatus = (status) => (
  status === PAYMENT_STATUS.fullyPaid || status === PAYMENT_STATUS.paymentNotRequired
    ? status
    : PAYMENT_STATUS.cancelled
);

export const setReceiptStatus = (status) => (
  status === RECEIPT_STATUS.fullyReceived || status === RECEIPT_STATUS.receiptNotRequired
    ? status
    : RECEIPT_STATUS.cancelled
);

export const getCancelledLine = (line) => ({
  ...line,
  receiptStatus: setReceiptStatus(line.receiptStatus),
  paymentStatus: setPaymentStatus(line.paymentStatus),
});
