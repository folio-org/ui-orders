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
  arrow: null,
};
