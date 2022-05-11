import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';

export const UPDATE_HOLDINGS_OPERATIONS = {
  move: 'move',
  findOrCreate: 'findOrCreate',
  create: 'create',
};

// TODO: update values with BE schema
export const UPDATE_HOLDINGS_OPERATIONS_MAP = {
  [UPDATE_HOLDINGS_OPERATIONS.move]: 'MOVE',
  [UPDATE_HOLDINGS_OPERATIONS.findOrCreate]: 'FIND_OR_CREATE',
  [UPDATE_HOLDINGS_OPERATIONS.create]: 'CREATE',
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
