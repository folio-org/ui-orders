import invert from 'lodash/invert';

import {
  ORDER_FORMATS,
  ORDER_TYPES,
} from '@folio/stripes-acq-components';
import { FormattedMessage } from 'react-intl';

export const PO_FORM_FIELDS = {
  acqUnitIds: 'acqUnitIds',
  approved: 'approved',
  assignedTo: 'assignedTo',
  billTo: 'billTo',
  closeReasonNote: 'closeReason.note',
  isSubscription: 'ongoing.isSubscription',
  manualPo: 'manualPo',
  manualRenewal: 'ongoing.manualRenewal',
  notes: 'notes',
  ongoing: 'ongoing',
  ongoingInterval: 'ongoing.interval',
  ongoingNotes: 'ongoing.notes',
  orderType: 'orderType',
  poNumber: 'poNumber',
  poNumberPrefix: 'poNumberPrefix',
  poNumberSuffix: 'poNumberSuffix',
  reEncumber: 'reEncumber',
  renewalDate: 'ongoing.renewalDate',
  reviewDate: 'ongoing.reviewDate',
  reviewPeriod: 'ongoing.reviewPeriod',
  shipTo: 'shipTo',
  tags: 'tags.tagList',
  template: 'template',
  vendor: 'vendor',
  workflowStatus: 'workflowStatus',
};

export const ORDER_TYPE_TRANSLATED_VALUES = Object.fromEntries(
  Object.entries(invert(ORDER_TYPES))
    .map(([orderType, key]) => [orderType, <FormattedMessage key={key} id={`ui-orders.order_type.${key}`} />]),
);

export const ORDER_FORMAT_TRANSLATED_VALUES = Object.fromEntries(
  Object.entries(invert(ORDER_FORMATS))
    .map(([orderType, key]) => [orderType, <FormattedMessage key={key} id={`ui-orders.order_format.${key}`} />]),
);
