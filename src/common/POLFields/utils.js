import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import {
  ERESOURCES,
  PHRESOURCES,
} from '../../components/POLine/const';

export const isEresource = (format) => ERESOURCES.includes(format);

export const isFresource = (format) => PHRESOURCES.includes(format);

export const isOtherResource = (format) => format === ORDER_FORMATS.other;
