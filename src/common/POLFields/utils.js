import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import {
  ERESOURCES,
  PHRESOURCES,
} from '../../components/POLine/const';

export const isEresource = (format) => ERESOURCES.includes(format);

export const isPhresource = (format) => PHRESOURCES.includes(format);

export const isOtherResource = (format) => format === ORDER_FORMATS.other;

export const isBindaryActiveDisabled = (orderFormat) => {
  if (!orderFormat) {
    return false;
  }

  return (
    orderFormat !== ORDER_FORMATS.PEMix &&
    orderFormat !== ORDER_FORMATS.physicalResource
  );
};
