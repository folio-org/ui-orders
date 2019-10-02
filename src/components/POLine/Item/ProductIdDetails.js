import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import {
  MultiColumnList,
} from '@folio/stripes/components';

const columnMapping = {
  productId: <FormattedMessage id="ui-orders.itemDetails.productId" />,
  qualifier: <FormattedMessage id="ui-orders.itemDetails.qualifier" />,
  productIdType: <FormattedMessage id="ui-orders.itemDetails.productIdType" />,
};
const visibleColumns = ['productId', 'qualifier', 'productIdType'];

function ProductIdDetails({ itemIdDetails, identifierTypes }) {
  const formatter = { productIdType: ({ productIdType }) => get(find(identifierTypes, { id: productIdType }), 'name', '') };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={itemIdDetails}
      formatter={formatter}
      id="list-product-ids"
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
}

ProductIdDetails.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  itemIdDetails: PropTypes.arrayOf(PropTypes.object),
};

ProductIdDetails.defaultProps = {
  identifierTypes: [],
  itemIdDetails: [],
};

export default ProductIdDetails;
