import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export const PO_TEMPLATE_FIELDS_MAP = {
  'tags.tagList': 'poTags.tagList',
};

export const LINE_LISTING_COLUMN_MAPPING = {
  poLineNumber: <FormattedMessage id="ui-orders.poLine.number" />,
  title: <FormattedMessage id="ui-orders.lineListing.titleOrPackage" />,
  productId: <FormattedMessage id="ui-orders.lineListing.productId" />,
  vendorRefNumber: <FormattedMessage id="ui-orders.lineListing.refNumber" />,
  fundCode: <FormattedMessage id="ui-orders.lineListing.fundCode" />,
  estimatedPrice: <FormattedMessage id="ui-orders.cost.estimatedPrice" />,
  arrow: null,
};

export const ACCORDION_ID = {
  purchaseOrder: 'purchaseOrder',
  ongoing: 'ongoing',
  poSummary: 'poSummary',
};

export const INITIAL_SECTIONS = Object.keys(ACCORDION_ID).reduce(
  (acc, id) => ({ ...acc, [id]: true }), {},
);

// Mapping between attribute (field) in form and id of accordion
export const MAP_FIELD_ACCORDION = {
  poNumber: ACCORDION_ID.purchaseOrder,
  vendor: ACCORDION_ID.purchaseOrder,
  orderType: ACCORDION_ID.purchaseOrder,
  notes: ACCORDION_ID.purchaseOrder,
};
