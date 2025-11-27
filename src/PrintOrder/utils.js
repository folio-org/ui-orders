import pick from 'lodash/pick';

import {
  fetchTenantAddressesByIds,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { getRecordMap } from '../common/utils';

export const getPrintPageStyles = () => `
  @page {
    size: A4 landscape;
    margin: 30px;
  }

  @media print {
    html, body {
      height: auto !important;
      overflow: initial !important;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
`;

export const buildAddressString = (address = {}) => (
  Object.values(
    pick(address, [
      'addressLine1',
      'addressLine2',
      'city',
      'stateRegion',
      'zipCode',
      'country',
    ]),
  )
    .filter(Boolean)
    .join(', ')
);

export const getOrderPrintData = async (ky, order = {}) => {
  const vendor = await ky.get(`${VENDORS_API}/${order.vendor}`).json().catch(() => ({}));
  const addressIds = [...new Set([order.billTo, order.shipTo])].filter(Boolean);

  const addresses = addressIds.length
    ? await fetchTenantAddressesByIds(ky)(addressIds).then((res) => res.addresses).catch(() => [])
    : [];
  const addressMap = getRecordMap(addresses);

  return ({
    vendorRecord: vendor,
    billToRecord: addressMap[order.billTo],
    shipToRecord: addressMap[order.shipTo],
  });
};
