import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';

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

export const ITEMS_COLUMN_NAMES = {
  barcode: 'barcode',
  status: 'status',
  copyNumber: 'copyNumber',
  loanType: 'loanType',
  tenantId: 'tenantId',
  effectiveLocation: 'effectiveLocation',
  enumeration: 'enumeration',
  chronology: 'chronology',
  volume: 'volume',
  yearCaption: 'yearCaption',
  materialType: 'materialType',
};
