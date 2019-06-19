import React from 'react';
import { FormattedMessage } from 'react-intl';

export const FILTERS = {
  ACCESS_PROVIDER: 'accessProvider',
  ACQUISITION_METHOD: 'acquisitionMethod',
  ACTIVATED: 'activated',
  ACTUAL_RECEIPT_DATE: 'receiptDate',
  CLAIM_GRACE: 'grace',
  CLAIM_SENT: 'sent',
  CLAIM: 'claims',
  COLLECTION: 'collection',
  DATE_CREATED: 'createdDate',
  EXPECTED_ACTIVATION_DATE: 'expectedActivation',
  EXPECTED_RECEIPT_DATE: 'expectedReceiptDate',
  FUND_CODE: 'fundDistribution',
  LOCATION: 'locations',
  MATERIAL_TYPE_ELECTRONIC: 'materialTypeElectronic',
  MATERIAL_TYPE_PHYSICAL: 'materialTypePhysical',
  ORDER_FORMAT: 'orderFormat',
  PAYMENT_STATUS: 'paymentStatus',
  RECEIPT_DUE: 'receiptDue',
  RECEIPT_STATUS: 'receiptStatus',
  RUSH: 'rush',
  SOURCE_CODE: 'source',
  SUBSCRIPTION_FROM: 'subscriptionFrom',
  SUBSCRIPTION_TO: 'subscriptionTo',
  TRIAL: 'trial',
  VENDOR: 'vendor',
};

export const BOOLEAN_OPTIONS = [
  {
    value: 'true',
    label: <FormattedMessage id="ui-orders.filter.true" />,
  },
  {
    value: 'false',
    label: <FormattedMessage id="ui-orders.filter.false" />,
  },
];
