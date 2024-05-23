import { CUSTOM_FIELDS_FILTER } from '@folio/stripes-acq-components';

import {
  ENTITY_TYPE_ORDER,
  ENTITY_TYPE_PO_LINE,
} from '../../constants';
import {
  EXPORT_LINE_FIELDS,
  EXPORT_LINE_FIELDS_OPTIONS,
  EXPORT_ORDER_FIELDS,
  EXPORT_ORDER_FIELDS_OPTIONS,
} from '../constants';

export const getExportOrderFields = (customFields = []) => {
  return customFields
    .filter((cf) => cf.entityType === ENTITY_TYPE_ORDER)
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
    .filter((cf) => cf.entityType === ENTITY_TYPE_PO_LINE)
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
    .filter((cf) => cf.entityType === ENTITY_TYPE_ORDER)
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
    .filter((cf) => cf.entityType === ENTITY_TYPE_PO_LINE)
    .reduce(
      (acc, cf) => {
        acc.push({ label: labelPrefix + cf.name, value: `${CUSTOM_FIELDS_FILTER}.${cf.refId}` });

        return acc;
      },
      [...EXPORT_LINE_FIELDS_OPTIONS],
    );
};
