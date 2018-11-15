import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Col, InfoPopover, Row, Select, TextField } from '@folio/stripes/components';
import { Required } from '../../Utils/Validate';

class CostForm extends Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      dropdown: PropTypes.shape({
        currencyDD: PropTypes.array
      })
    })
  }

  render() {
    const currencyDD = (this.props.parentResources.dropdown || {}).currencyDD || [];
    return (
      <Row>
        <Col xs={6}>
          <Field
            label="List Unit Price"
            name="cost.list_price"
            id="cost.list_price"
            type="number"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={6}>
          <Field
            label="Currency&#42;"
            name="cost.currency"
            id="cost.currency"
            type="select"
            component={Select}
            validate={[Required]}
            dataOptions={currencyDD}
            fullWidth
          />
        </Col>
        <Col xs={6}>
          <Field
            label="Quantity Physical"
            name="cost.quantity_physical"
            id="cost.quantity_physical"
            type="number"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={6}>
          <Field
            label="Quantity Electronic"
            name="cost.quantity_electronic"
            id="cost.quantity_electronic"
            type="number"
            component={TextField}
            fullWidth
          />
        </Col>
        <Col xs={6}>
          <Field
            label={
              <div>
                <span>Estimated Price</span>
                <InfoPopover
                  content="List Unit Price x Quantity Ordered"
                  buttonLabel="Read more"
                />
              </div>
            }
            name="cost.po_line_estimated_price"
            id="cost.po_line_estimated_price"
            type="number"
            component={TextField}
            fullWidth
          />
        </Col>
      </Row>
    );
  }
}

export default CostForm;
