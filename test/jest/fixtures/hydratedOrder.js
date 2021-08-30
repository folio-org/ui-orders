import { order } from './order';
import { exportReport } from './exportReport';

const vendorRecord = {
  addresses: [{
    isPrimary: true,
  }],
  phoneNumbers: [{
    isPrimary: true,
  }],
};

export const hydratedOrder = {
  billToAddress: 'address',
  order,
  lines: [{
    billToRecord: exportReport[0].billToRecord,
    shipToRecord: exportReport[0].shipToRecord,
    vendorRecord,
  }],
  shipToAddress: 'address',
  vendor: vendorRecord,
  vendorPrimaryAddress: vendorRecord.addresses[0],
  vendorPrimaryPhone: vendorRecord.phoneNumbers[0],
};
