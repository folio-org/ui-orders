import { CUSTOM_FIELDS_FILTER } from '@folio/stripes-acq-components';

import {
  EXPORT_LINE_FIELDS,
  EXPORT_LINE_FIELDS_OPTIONS,
  EXPORT_ORDER_FIELDS,
  EXPORT_ORDER_FIELDS_OPTIONS,
} from '../constants';

export const getExportOrderFields = (customFields = []) => {
  return customFields
    .filter((cf) => cf.entityType === 'purchase_order')
    .reduce(
      (acc, cf) => {
        acc[`${CUSTOM_FIELDS_FILTER}.${cf.refId}`] = cf.name;

        return acc;
      },
      { ...EXPORT_ORDER_FIELDS },
    );
};

export const getExportLineFields = (customFields = []) => {
  return customFields
    .filter((cf) => cf.entityType === 'po_line')
    .reduce(
      (acc, cf) => {
        acc[`${CUSTOM_FIELDS_FILTER}.${cf.refId}`] = cf.name;

        return acc;
      },
      { ...EXPORT_LINE_FIELDS },
    );
};

export const getExportOrderFieldsOptions = (labelPrefix = '', customFields = []) => {
  return customFields
    .filter((cf) => cf.entityType === 'purchase_order')
    .reduce(
      (acc, cf) => {
        acc.push({ label: labelPrefix + cf.name, value: `${CUSTOM_FIELDS_FILTER}.${cf.refId}` });

        return acc;
      },
      [...EXPORT_ORDER_FIELDS_OPTIONS],
    );
};

export const getExportLineFieldsOptions = (labelPrefix = '', customFields = []) => {
  return customFields
    .filter((cf) => cf.entityType === 'po_line')
    .reduce(
      (acc, cf) => {
        acc.push({ label: labelPrefix + cf.name, value: `${CUSTOM_FIELDS_FILTER}.${cf.refId}` });

        return acc;
      },
      [...EXPORT_LINE_FIELDS_OPTIONS],
    );
};
