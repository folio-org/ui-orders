import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { KeyValue, InfoPopover, Row, Col } from '@folio/stripes/components';

class CostView extends React.Component {
  static propTypes = {
    cost: PropTypes.object
  }

  render() {
    const { cost } = this.props;
    return (
      <Row>
        <Col xs={6}>
          <KeyValue
            label="List Unit Price"
            value={get(cost, 'list_price')}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label="Currency"
            value={get(cost, 'currency')}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label="Quantity Physical"
            value={get(cost, 'quantity_physical')}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label="Quantity electronic"
            value={get(cost, 'quantity_electronic')}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={
              <div>
                <span>Estimated Price</span>
                <InfoPopover
                  content="List Unit Price x Quantity Ordered"
                  buttonLabel="Read more"
                />
              </div>
            }
            value={get(cost, 'po_line_estimated_price')}
          />
        </Col>
      </Row>
    );
  }
}

export default CostView;
