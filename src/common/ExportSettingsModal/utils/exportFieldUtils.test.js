import { CUSTOM_FIELDS_FILTER } from '@folio/stripes-acq-components';

import {
  getExportLineFields,
  getExportLineFieldsOptions,
  getExportOrderFields,
  getExportOrderFieldsOptions,
} from './exportFieldUtils';
import {
  EXPORT_LINE_FIELDS,
  EXPORT_LINE_FIELDS_OPTIONS,
  EXPORT_ORDER_FIELDS,
  EXPORT_ORDER_FIELDS_OPTIONS,
} from '../constants';

const customFields = [
  {
    name: 'External order number',
    refId: 'externalOrderNumber',
    type: 'TEXTBOX_SHORT',
    entityType: 'purchase_order',
  },
  {
    name: 'Membership',
    refId: 'membership',
    type: 'SINGLE_SELECT_DROPDOWN',
    entityType: 'po_line',
  },
];

describe('fieldUtils', () => {
  describe('getExportOrderFields', () => {
    it('should return correct default values', () => {
      const result = getExportOrderFields();

      expect(result).toEqual(EXPORT_ORDER_FIELDS);
    });

    it('should return correct values for given custom fields', () => {
      const result = getExportOrderFields(customFields);

      expect(result).toEqual({
        ...EXPORT_ORDER_FIELDS,
        [`${CUSTOM_FIELDS_FILTER}.externalOrderNumber`]: 'External order number',
      });
    });
  });

  describe('getExportLineFields', () => {
    it('should return correct default values', () => {
      const result = getExportLineFields();

      expect(result).toEqual(EXPORT_LINE_FIELDS);
    });

    it('should return correct values for given custom fields', () => {
      const result = getExportLineFields(customFields);

      expect(result).toEqual({
        ...EXPORT_LINE_FIELDS,
        [`${CUSTOM_FIELDS_FILTER}.membership`]: 'Membership',
      });
    });
  });

  describe('getExportOrderFieldsOptions', () => {
    it('should return correct default values', () => {
      const result = getExportOrderFieldsOptions();

      expect(result).toEqual(EXPORT_ORDER_FIELDS_OPTIONS);
    });

    it('should return correct values for given custom fields', () => {
      const result = getExportOrderFieldsOptions('Custom fields - ', customFields);

      expect(result).toEqual([
        ...EXPORT_ORDER_FIELDS_OPTIONS,
        ...[{ label: 'Custom fields - External order number', value: `${CUSTOM_FIELDS_FILTER}.externalOrderNumber` }],
      ]);
    });
  });

  describe('getExportLineFieldsOptions', () => {
    it('should return correct default values', () => {
      const result = getExportLineFieldsOptions();

      expect(result).toEqual(EXPORT_LINE_FIELDS_OPTIONS);
    });

    it('should return correct values for given custom fields', () => {
      const result = getExportLineFieldsOptions('Custom fields - ', customFields);

      expect(result).toEqual([
        ...EXPORT_LINE_FIELDS_OPTIONS,
        ...[{ label: 'Custom fields - Membership', value: `${CUSTOM_FIELDS_FILTER}.membership` }],
      ]);
    });
  });
});
