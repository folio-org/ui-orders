export const ERESOURCE = 'Electronic Resource';
export const PHYSICAL = 'Physical Resource';
export const PE_MIX = 'P/E Mix';
export const OTHER = 'Other';

export const ERESOURCES = [ERESOURCE, PE_MIX];
export const PHRESOURCES = [PHYSICAL, PE_MIX];

export const ACCORDION_ID = {
  costDetails: 'costDetails',
  eresources: 'eresources',
  fundDistribution: 'fundDistribution',
  itemDetails: 'itemDetails',
  lineDetails: 'lineDetails',
  location: 'location',
  other: 'other',
  physical: 'physical',
  poLine: 'poLine',
  relatedInvoices: 'relatedInvoices',
  vendor: 'vendor',
};

// Mapping between attribute (field) in form and id of accordion
export const MAP_FIELD_ACCORDION = {
  cost: ACCORDION_ID.costDetails,
  details: ACCORDION_ID.itemDetails,
  eresource: ACCORDION_ID.eresources,
  fundDistribution: ACCORDION_ID.fundDistribution,
  locations: ACCORDION_ID.location,
  orderFormat: ACCORDION_ID.lineDetails,
  other: ACCORDION_ID.other,
  physical: ACCORDION_ID.physical,
  poLineNumber: ACCORDION_ID.lineDetails,
  publicationDate: ACCORDION_ID.itemDetails,
  title: ACCORDION_ID.itemDetails,
  vendorDetail: ACCORDION_ID.vendor,
};

export const DISCOUNT_TYPE = {
  amount: 'amount',
  percentage: 'percentage',
};

export const INVENTORY_RECORDS_TYPE = {
  all: 'Instance, Holding, Item',
  instance: 'Instance',
  instanceAndHolding: 'Instance, Holding',
  none: 'None',
};

export const INVENTORY_RECORDS_TYPE_FOR_SELECT = [
  { label: 'ui-orders.settings.createInventory.recordType.all', value: INVENTORY_RECORDS_TYPE.all },
  { label: 'ui-orders.settings.createInventory.recordType.instance', value: INVENTORY_RECORDS_TYPE.instance },
  { label: 'ui-orders.settings.createInventory.recordType.instanceAndHolding', value: INVENTORY_RECORDS_TYPE.instanceAndHolding },
  { label: 'ui-orders.settings.createInventory.recordType.none', value: INVENTORY_RECORDS_TYPE.none },
];

export const ALLOWED_YEAR_LENGTH = 4;
