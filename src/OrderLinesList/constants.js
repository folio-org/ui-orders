import React from 'react';
import { FormattedMessage } from 'react-intl';

export const FILTERS = {
  ACCESS_PROVIDER: 'eresource.accessProvider',
  ACQUISITION_METHOD: 'acquisitionMethod',
  ACTIVATED: 'eresource.activated',
  ACTUAL_RECEIPT_DATE: 'receiptDate',
  CLAIM_GRACE: 'grace',
  CLAIM_SENT: 'sent',
  CLAIM: 'claims',
  COLLECTION: 'collection',
  DATE_CREATED: 'metadata.createdDate',
  EXPECTED_ACTIVATION_DATE: 'eresource.expectedActivation',
  EXPECTED_RECEIPT_DATE: 'physical.expectedReceiptDate',
  FUND_CODE: 'fundDistribution',
  LOCATION: 'locations',
  MATERIAL_TYPE_ELECTRONIC: 'eresource.materialType',
  MATERIAL_TYPE_PHYSICAL: 'physical.materialType',
  ORDER_FORMAT: 'orderFormat',
  PAYMENT_STATUS: 'paymentStatus',
  RECEIPT_DUE: 'physical.receiptDue',
  RECEIPT_STATUS: 'receiptStatus',
  RUSH: 'rush',
  SOURCE_CODE: 'source',
  SUBSCRIPTION_FROM: 'details.subscriptionFrom',
  SUBSCRIPTION_TO: 'details.subscriptionTo',
  TRIAL: 'eresource.trial',
  VENDOR: 'vendor',
  TAGS: 'tags.tagList',
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
