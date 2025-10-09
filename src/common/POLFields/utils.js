import get from 'lodash/get';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import {
  ERESOURCES,
  OPTION_VALUE_WITH_BINDERY_ACTIVE,
  PHRESOURCES,
} from '../../components/POLine/const';
import { isWorkflowStatusNotPending } from '../../components/PurchaseOrder/util';
import { POL_FORM_FIELDS } from '../constants';

export const isEresource = (format) => ERESOURCES.includes(format);

export const isPhresource = (format) => PHRESOURCES.includes(format);

export const isOtherResource = (format) => format === ORDER_FORMATS.other;

export const isBinderyActiveDisabled = (values, order) => {
  const orderFormat = get(values, POL_FORM_FIELDS.orderFormat);
  const physicalCreateInventory = get(values, POL_FORM_FIELDS.physicalCreateInventory);

  if (!orderFormat) {
    return false;
  }

  if (
    order
    && isWorkflowStatusNotPending(order)
    && physicalCreateInventory !== OPTION_VALUE_WITH_BINDERY_ACTIVE
  ) {
    return true;
  }

  return (
    orderFormat !== ORDER_FORMATS.PEMix
    && orderFormat !== ORDER_FORMATS.physicalResource
  );
};
