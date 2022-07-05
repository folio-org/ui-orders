import { FormattedMessage } from 'react-intl';

import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';
import { NoValue } from '@folio/stripes/components';

export const REPLACE_OPERATION_TYPE = 'Replace Instance Ref';

export const UPDATE_HOLDINGS_OPERATIONS = {
  move: 'move',
  findOrCreate: 'findOrCreate',
  create: 'create',
};

export const ERROR_CODES = {
  itemUpdateFailed: 'itemUpdateFailed',
};

export const UPDATE_HOLDINGS_OPERATIONS_MAP = {
  [UPDATE_HOLDINGS_OPERATIONS.move]: 'Move',
  [UPDATE_HOLDINGS_OPERATIONS.findOrCreate]: 'Find or Create',
  [UPDATE_HOLDINGS_OPERATIONS.create]: 'Create',
};

export const SHOW_DETAILED_MODAL_CONFIGS = {
  [INVENTORY_RECORDS_TYPE.none]: false,
  [INVENTORY_RECORDS_TYPE.instance]: false,
  [INVENTORY_RECORDS_TYPE.instanceAndHolding]: true,
  [INVENTORY_RECORDS_TYPE.all]: true,
};

export const SHOW_DELETE_HOLDINGS_MODAL_CONFIGS = {
  [UPDATE_HOLDINGS_OPERATIONS_MAP[UPDATE_HOLDINGS_OPERATIONS.move]]: false,
  [UPDATE_HOLDINGS_OPERATIONS_MAP[UPDATE_HOLDINGS_OPERATIONS.findOrCreate]]: true,
  [UPDATE_HOLDINGS_OPERATIONS_MAP[UPDATE_HOLDINGS_OPERATIONS.create]]: true,
};

export const ITEMS_VISIBLE_COLUMNS = [
  'barcode',
  'status',
  'copyNumber',
  'loanType',
  'effectiveLocation',
  'enumeration',
  'chronology',
  'volume',
  'yearCaption',
  'materialType',
];

export const ITEMS_COLUMN_MAPPING = {
  barcode: <FormattedMessage id="ui-inventory.item.barcode" />,
  status: <FormattedMessage id="ui-inventory.status" />,
  copyNumber: <FormattedMessage id="ui-inventory.copyNumber" />,
  materialType: <FormattedMessage id="ui-inventory.materialType" />,
  loanType: <FormattedMessage id="ui-inventory.loanType" />,
  effectiveLocation: <FormattedMessage id="ui-inventory.effectiveLocationShort" />,
  enumeration: <FormattedMessage id="ui-inventory.enumeration" />,
  chronology: <FormattedMessage id="ui-inventory.chronology" />,
  volume: <FormattedMessage id="ui-inventory.volume" />,
  yearCaption: <FormattedMessage id="ui-inventory.yearCaption" />,
};

export const ITEMS_ROW_FORMATTER = {
  barcode: item => item.barcode || <NoValue />,
  status: item => item.status?.name || <NoValue />,
  copyNumber: item => item.copyNumber || <NoValue />,
  materialType: item => item.materialType?.name || <NoValue />,
  loanType: item => item.temporaryLoanType?.name || <NoValue />,
  effectiveLocation: item => item.effectiveLocation?.name || <NoValue />,
  enumeration: item => item.enumeration || <NoValue />,
  chronology: item => item.chronology || <NoValue />,
  volume: item => item.volume || <NoValue />,
  yearCaption: item => item.yearCaption?.join(', ') || <NoValue />,
};
