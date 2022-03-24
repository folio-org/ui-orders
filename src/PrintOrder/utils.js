import { pick } from 'lodash';

import {
  VENDORS_API,
  CONFIG_API,
} from '@folio/stripes-acq-components';

import {
  CONFIG_ADDRESSES,
  MODULE_TENANT,
} from '../components/Utils/const';
import {
  getAddresses,
  getRecordMap,
} from '../common/utils';

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
  const subQuery = addressIds.map(id => `id==${id}`).join(' or ');
  const searchParams = {
    query: `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES} and (${subQuery}))`,
  };
  const addressesResp = addressIds.length
    ? await ky.get(CONFIG_API, { searchParams }).json().catch(() => ({}))
    : {};
  const addresses = getAddresses(addressesResp?.configs || []);
  const addressMap = getRecordMap(addresses);

  return ({
    vendorRecord: vendor,
    billToRecord: addressMap[order.billTo],
    shipToRecord: addressMap[order.shipTo],
  });
};
