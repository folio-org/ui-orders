import { FILTERS } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const filterConfig = [
  {
    name: FILTERS.RECEIPT_STATUS,
    cql: FILTERS.RECEIPT_STATUS,
    values: [],
  },
  {
    name: FILTERS.PAYMENT_STATUS,
    cql: FILTERS.PAYMENT_STATUS,
    values: [],
  },
  {
    name: FILTERS.ACQUISITION_METHOD,
    cql: FILTERS.ACQUISITION_METHOD,
    values: [],
  },
  {
    name: FILTERS.LOCATION,
    cql: FILTERS.LOCATION,
    values: [],
  },
  {
    name: FILTERS.FUND_CODE,
    cql: FILTERS.FUND_CODE,
    values: [],
  },
  {
    name: FILTERS.ORDER_FORMAT,
    cql: FILTERS.ORDER_FORMAT,
    values: [],
  },
  {
    name: FILTERS.MATERIAL_TYPE_ELECTRONIC,
    cql: 'eresource.materialType',
    values: [],
  },
  {
    name: FILTERS.MATERIAL_TYPE_PHYSICAL,
    cql: 'physical.materialType',
    values: [],
  },
  {
    name: FILTERS.DATE_CREATED,
    cql: `metadata.${FILTERS.DATE_CREATED}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.VENDOR,
    cql: FILTERS.VENDOR,
    values: [],
  },
  {
    name: FILTERS.SOURCE_CODE,
    cql: `${FILTERS.SOURCE_CODE}.code`,
    values: [],
  },
  {
    name: FILTERS.COLLECTION,
    cql: FILTERS.COLLECTION,
    values: [],
  },
  {
    name: FILTERS.RUSH,
    cql: FILTERS.RUSH,
    values: [],
  },
  {
    name: FILTERS.ACCESS_PROVIDER,
    cql: `eresource.${FILTERS.ACCESS_PROVIDER}`,
    values: [],
  },
  {
    name: FILTERS.ACTIVATED,
    cql: `eresource.${FILTERS.ACTIVATED}`,
    values: [],
  },
  {
    name: FILTERS.EXPECTED_ACTIVATION_DATE,
    cql: `eresource.${FILTERS.EXPECTED_ACTIVATION_DATE}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.TRIAL,
    cql: `eresource.${FILTERS.TRIAL}`,
    values: [],
  },
  {
    name: FILTERS.SUBSCRIPTION_FROM,
    cql: `details.${FILTERS.SUBSCRIPTION_FROM}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.SUBSCRIPTION_TO,
    cql: `details.${FILTERS.SUBSCRIPTION_TO}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.ACTUAL_RECEIPT_DATE,
    cql: FILTERS.ACTUAL_RECEIPT_DATE,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.EXPECTED_RECEIPT_DATE,
    cql: `physical.${FILTERS.EXPECTED_RECEIPT_DATE}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.RECEIPT_DUE,
    cql: `physical.${FILTERS.RECEIPT_DUE}`,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
  {
    name: FILTERS.CLAIM,
    cql: FILTERS.CLAIM,
    values: [],
  },
  {
    name: FILTERS.CLAIM_GRACE,
    cql: FILTERS.CLAIM,
    values: [],
  },
  {
    name: FILTERS.CLAIM_SENT,
    cql: FILTERS.CLAIM,
    isRange: true,
    rangeSeparator: ':',
    values: [],
  },
];
