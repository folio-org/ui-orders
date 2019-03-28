export const ERESOURCE = 'Electronic Resource';
export const PHYSICAL = 'Physical Resource';
export const PE_MIX = 'P/E Mix';
export const OTHER = 'Other';
export const PO_LINE_FORM = 'POLineForm';

export const ERESOURCES = [ERESOURCE, PE_MIX];
export const PHRESOURCES = [PHYSICAL, PE_MIX];

export const ACCORDION_ID = {
  costDetails: 'costDetails',
  eresources: 'eresources',
  fundDistribution: 'fundDistribution',
  itemDetails: 'itemDetails',
  lineDetails: 'lineDetails',
  location: 'location',
  physical: 'physical',
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
  poLineNumber: ACCORDION_ID.lineDetails,
  publicationDate: ACCORDION_ID.itemDetails,
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
