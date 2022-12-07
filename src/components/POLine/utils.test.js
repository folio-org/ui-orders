import {
  INVENTORY_RECORDS_TYPE,
  ORDER_FORMATS,
  ORDER_STATUSES,
  PAYMENT_STATUS,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import {
  getCancelledLine,
  getCreateInventory,
  getPoLineFieldsLabelMap,
  isCancelableLine,
  isOrderLineCancelled,
  setPaymentStatus,
  setReceiptStatus,
} from './utils';

describe('isCancelableLine', () => {
  describe('isOrderLineCancelled', () => {
    it('should return false', () => {
      expect(isOrderLineCancelled({
        receiptStatus: RECEIPT_STATUS.fullyReceived,
        paymentStatus: PAYMENT_STATUS.fullyPaid,
      })).toBe(false);
    });
    it('should return true', () => {
      expect(isOrderLineCancelled({
        receiptStatus: RECEIPT_STATUS.cancelled,
        paymentStatus: PAYMENT_STATUS.cancelled,
      })).toBe(true);
    });
    it('should return true', () => {
      expect(isOrderLineCancelled({
        receiptStatus: RECEIPT_STATUS.cancelled,
        paymentStatus: PAYMENT_STATUS.paymentNotRequired,
      })).toBe(true);
    });
  });

  describe('isCancelableLine', () => {
    it('should return false', () => {
      expect(isCancelableLine(
        {
          receiptStatus: RECEIPT_STATUS.fullyReceived,
          paymentStatus: PAYMENT_STATUS.fullyPaid,
        },
        { workflowStatus: ORDER_STATUSES.pending },
      )).toBe(false);
    });
    it('should return false', () => {
      expect(isCancelableLine(
        {
          receiptStatus: RECEIPT_STATUS.receiptNotRequired,
          paymentStatus: PAYMENT_STATUS.paymentNotRequired,
        },
        { workflowStatus: ORDER_STATUSES.open },
      )).toBe(false);
    });
    it('should return false', () => {
      expect(isCancelableLine(
        {
          receiptStatus: RECEIPT_STATUS.cancelled,
          paymentStatus: PAYMENT_STATUS.cancelled,
        },
        { workflowStatus: ORDER_STATUSES.open },
      )).toBe(false);
    });
    it('should return false', () => {
      expect(isCancelableLine(
        {
          receiptStatus: RECEIPT_STATUS.fullyReceived,
          paymentStatus: PAYMENT_STATUS.paymentNotRequired,
        },
        { workflowStatus: ORDER_STATUSES.open },
      )).toBe(false);
    });
    it('should return true', () => {
      expect(isCancelableLine(
        {
          receiptStatus: RECEIPT_STATUS.pending,
          paymentStatus: PAYMENT_STATUS.paymentNotRequired,
        },
        { workflowStatus: ORDER_STATUSES.open },
      )).toBe(true);
    });
  });

  describe('setPaymentStatus', () => {
    it('should return fully paid status', () => {
      expect(setPaymentStatus(PAYMENT_STATUS.fullyPaid)).toBe(PAYMENT_STATUS.fullyPaid);
    });
    it('should return payment not required status', () => {
      expect(setPaymentStatus(PAYMENT_STATUS.paymentNotRequired)).toBe(PAYMENT_STATUS.paymentNotRequired);
    });
    it('should return cancelled status', () => {
      expect(setPaymentStatus(PAYMENT_STATUS.cancelled)).toBe(PAYMENT_STATUS.cancelled);
    });
  });

  describe('setReceiptStatus', () => {
    it('should return fully received status', () => {
      expect(setReceiptStatus(RECEIPT_STATUS.fullyReceived)).toEqual(RECEIPT_STATUS.fullyReceived);
    });
    it('should return receipt not required status', () => {
      expect(setReceiptStatus(RECEIPT_STATUS.receiptNotRequired)).toEqual(RECEIPT_STATUS.receiptNotRequired);
    });
    it('should return cancelled status', () => {
      expect(setReceiptStatus(RECEIPT_STATUS.cancelled)).toEqual(RECEIPT_STATUS.cancelled);
    });
  });

  describe('getCancelledLine', () => {
    it('should return cancelled line without updates', () => {
      expect(getCancelledLine({
        receiptStatus: RECEIPT_STATUS.fullyReceived,
        paymentStatus: PAYMENT_STATUS.fullyPaid,
      })).toEqual(({
        receiptStatus: RECEIPT_STATUS.fullyReceived,
        paymentStatus: PAYMENT_STATUS.fullyPaid,
      }));
    });
    it('should return cancelled line without cancelled statuses', () => {
      expect(getCancelledLine({
        receiptStatus: 'any status',
        paymentStatus: 'any status',
      })).toEqual(({
        receiptStatus: RECEIPT_STATUS.cancelled,
        paymentStatus: PAYMENT_STATUS.cancelled,
      }));
    });
  });

  describe('getCreateInventory', () => {
    it('should return create inventory field value for electronic order line', () => {
      expect(getCreateInventory({
        orderFormat: ORDER_FORMATS.electronicResource,
        eresource: { createInventory: INVENTORY_RECORDS_TYPE.none },
      })).toEqual(INVENTORY_RECORDS_TYPE.none);
    });
    it('should return create inventory field value for electronic order line', () => {
      expect(getCreateInventory({
        orderFormat: ORDER_FORMATS.physicalResource,
        physical: { createInventory: INVENTORY_RECORDS_TYPE.instance },
      })).toEqual(INVENTORY_RECORDS_TYPE.instance);
    });
    it('should return create inventory field value for P/E mix order line', () => {
      expect(getCreateInventory({
        orderFormat: ORDER_FORMATS.PEMix,
        eresource: { createInventory: INVENTORY_RECORDS_TYPE.none },
        physical: { createInventory: INVENTORY_RECORDS_TYPE.instance },
      })).toEqual(INVENTORY_RECORDS_TYPE.none);
    });
  });
});

describe('getPoLineFieldsLabelMap', () => {
  it('should return labels\' map for fields of package PO Line', () => {
    expect(getPoLineFieldsLabelMap({ isPackage: true })).toEqual(
      expect.objectContaining({
        'titleOrPackage': 'ui-orders.itemDetails.packageName',
        'cost.listUnitPrice': 'ui-orders.cost.listPrice',
        'cost.quantityPhysical': 'ui-orders.cost.quantity',
        'cost.listUnitPriceElectronic': 'ui-orders.cost.listPrice',
        'cost.quantityElectronic': 'ui-orders.cost.quantity',
      }),
    );
  });

  it('should return labels\' map for fields of package PO Line with mixed order', () => {
    expect(getPoLineFieldsLabelMap({ isPackage: true, orderFormat: ORDER_FORMATS.PEMix })).toEqual(
      expect.objectContaining({
        'titleOrPackage': 'ui-orders.itemDetails.packageName',
        'cost.listUnitPrice': 'ui-orders.cost.listPriceOfPhysical',
        'cost.quantityPhysical': 'ui-orders.cost.quantityPhysical',
        'cost.listUnitPriceElectronic': 'ui-orders.cost.listPrice',
        'cost.quantityElectronic': 'ui-orders.cost.quantity',
      }),
    );
  });

  it('should return labels\' map for non-package PO Line fields', () => {
    expect(getPoLineFieldsLabelMap()).toEqual(
      expect.objectContaining({
        'titleOrPackage': 'ui-orders.itemDetails.title',
        'cost.listUnitPrice': 'ui-orders.cost.listPriceOfPhysical',
        'cost.quantityPhysical': 'ui-orders.cost.quantityPhysical',
        'cost.listUnitPriceElectronic': 'ui-orders.cost.unitPriceOfElectronic',
        'cost.quantityElectronic': 'ui-orders.cost.quantityElectronic',
      }),
    );
  });
});
