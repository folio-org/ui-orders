import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { KeyValue, Row, Col } from '@folio/stripes/components';

class AdjustmentsView extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object
  }

  render() {
    const { initialValues } = this.props;

    return (
      <Row>
        <Col xs={3}>
          <KeyValue label="Shipment" value={_.get(initialValues, 'shipment')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Insurance" value={_.get(initialValues, 'insurance')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Discount" value={_.get(initialValues, 'discount')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Overhead" value={_.toString(_.get(initialValues, 'overhead'))} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Credit" value={_.get(initialValues, 'credit')} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Tax 1" value={_.toString(_.get(initialValues, 'tax_1'))} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Tax 2" value={_.toString(_.get(initialValues, 'tax_2'))} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Use Pro Rate" value={_.toString(_.get(initialValues, 'use_pro_rate'))} />
        </Col>
      </Row>
    );
  }
}

export default AdjustmentsView;
