import { ORDER_TYPES } from '@folio/stripes-acq-components';

import { buildCommonTranslatedDictionary } from '../utils';

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

export const ORDER_TYPE_TRANSLATED_VALUES = buildCommonTranslatedDictionary(ORDER_TYPES, 'ui-orders.order_type.');
