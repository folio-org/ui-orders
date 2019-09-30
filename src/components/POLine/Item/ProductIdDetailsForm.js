import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';

import {
  Button,
  Col,
  IconButton,
  Row,
  TextField,
} from '@folio/stripes/components';
import { FieldSelect } from '@folio/stripes-acq-components';

class ProductIdDetailsForm extends Component {
  static propTypes = {
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
    onChangeField: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
  };

  static defaultProps = {
    required: true,
  };

  addFields = (fields) => {
    fields.push({});
  }

  removeFields = (fields, index) => {
    fields.remove(index);
    this.props.onChangeField();
  }

  renderForm = ({ fields }) => {
    return (
      <Row start="xs">
        <Col xs={12}>
          {fields.length === 0 &&
            <Col xs={12}>
              <div>
                <em>
                  <FormattedMessage id="ui-orders.itemDetails.addProductId" />
                </em>
              </div>
            </Col>
          }
          {fields.map(this.renderSubForm)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button
            data-test-add-product-ids-button
            onClick={() => this.addFields(fields)}
            disabled={this.props.disabled}
          >
            <FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />
          </Button>
        </Col>
      </Row>
    );
  }

  renderSubForm = (elem, index, fields) => {
    const { disabled, required } = this.props;

    return (
      <Row key={index}>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            name={`${elem}.productId`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.productId`)}
            disabled={disabled}
          />
        </Col>
        <Col xs={5}>
          <FieldSelect
            dataOptions={this.props.identifierTypes}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            name={`${elem}.productIdType`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.productIdType`)}
            required={required}
            disabled={disabled}
          />
        </Col>
        <Col
          style={{ paddingTop: '10px' }}
          xs={1}
        >
          <br />
          <IconButton
            data-test-remove-product-ids-button
            icon="trash"
            onClick={() => this.removeFields(fields, index)}
            disabled={this.props.disabled}
          >
            {<FormattedMessage id="ui-orders.itemDetails.removeBtn" />}
          </IconButton>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <FieldArray
        component={this.renderForm}
        name="details.productIds"
      />
    );
  }
}

export default ProductIdDetailsForm;
