import {
  INVENTORY_RECORDS_TYPE,
  ORDER_FORMATS,
  PAYMENT_STATUS,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusOpen,
} from '../PurchaseOrder/util';

export const isOrderLineCancelled = (line) => (
  (
    line.paymentStatus === PAYMENT_STATUS.cancelled && line.receiptStatus === RECEIPT_STATUS.cancelled
  ) ||
  (
    line.paymentStatus === PAYMENT_STATUS.cancelled &&
    (line.receiptStatus === RECEIPT_STATUS.fullyReceived || line.receiptStatus === RECEIPT_STATUS.receiptNotRequired)
  ) ||
  (
    line.receiptStatus === RECEIPT_STATUS.cancelled &&
    (line.paymentStatus === PAYMENT_STATUS.fullyPaid || line.paymentStatus === PAYMENT_STATUS.paymentNotRequired)
  )
);

export const isCancelableLine = (line, order) => (
  (isWorkflowStatusClosed(order) || isWorkflowStatusOpen(order)) &&
  !(
    ((
      line.receiptStatus === RECEIPT_STATUS.fullyReceived ||
      line.receiptStatus === RECEIPT_STATUS.receiptNotRequired
    ) &&
    (
      line.paymentStatus === PAYMENT_STATUS.fullyPaid ||
      line.paymentStatus === PAYMENT_STATUS.paymentNotRequired
    )) ||
    (
      line.receiptStatus === RECEIPT_STATUS.cancelled ||
      line.paymentStatus === PAYMENT_STATUS.cancelled
    )
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

export const getCreateInventory = (line) => {
  switch (line.orderFormat) {
    case ORDER_FORMATS.electronicResource: return line.eresource.createInventory;
    case ORDER_FORMATS.physicalResource:
    case ORDER_FORMATS.other: return line.physical.createInventory;
    case ORDER_FORMATS.PEMix: {
      const eresource = line.eresource.createInventory;
      const physical = line.physical.createInventory;

      if (
        (eresource === INVENTORY_RECORDS_TYPE.none || eresource === INVENTORY_RECORDS_TYPE.instance) &&
        (physical === INVENTORY_RECORDS_TYPE.none || physical === INVENTORY_RECORDS_TYPE.instance)
      ) return INVENTORY_RECORDS_TYPE.none;

      return undefined;
    }
    default: return undefined;
  }
};
