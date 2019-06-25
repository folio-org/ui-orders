import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  get,
  find,
} from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

class ProductIdDetails extends Component {
  static propTypes = {
    itemIdDetails: PropTypes.arrayOf(PropTypes.object),
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    itemIdDetails: {},
    identifierTypes: [],
  }

  constructor(props) {
    super(props);
    this.getProductDetails = this.getProductDetails.bind(this);
  }

  getProductDetails(val, key) {
    return (
      <Row key={key}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            value={get(val, 'productId')}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            value={get(val, 'productIdType')}
          />
        </Col>
      </Row>
    );
  }

  render() {
    const { itemIdDetails, identifierTypes } = this.props;
    const itemIdDetailsToDisplay = itemIdDetails.map(({ productId, productIdType }) => ({
      productId,
      productIdType: get(find(identifierTypes, { id: productIdType }), 'name', ''),
    }));

    return (
      <Col xs={12}>
        {itemIdDetailsToDisplay.map(this.getProductDetails)}
      </Col>
    );
  }
}

export default ProductIdDetails;
