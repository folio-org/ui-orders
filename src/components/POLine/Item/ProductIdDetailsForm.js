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
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../Utils/Validate';

class ProductIdDetailsForm extends Component {
  static propTypes = {
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
    onChangeField: PropTypes.func.isRequired,
    setInstanceId: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.addFields = this.addFields.bind(this);
    this.removeFields = this.removeFields.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.renderSubForm = this.renderSubForm.bind(this);
  }

  addFields(fields) {
    fields.push({});
  }

  removeFields(fields, index) {
    fields.remove(index);
  }

  renderForm({ fields }) {
    return (
      <Row>
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
            onClick={() => this.addFields(fields)}
          >
            <FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />
          </Button>
        </Col>
      </Row>
    );
  }

  renderSubForm(elem, index, fields) {
    return (
      <Row key={index}>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            name={`${elem}.productId`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.productId`)}
          />
        </Col>
        <Col xs={5}>
          <Field
            component={Select}
            dataOptions={this.props.identifierTypes}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            name={`${elem}.productIdType`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.productIdType`)}
            placeholder=" "
            required
            validate={[Required]}
          />
        </Col>
        <Col xs={1} style={{ paddingTop: '4px' }}>
          <br />
          <Button
            buttonStyle="danger"
            onClick={() => {
              this.removeFields(fields, index);
              this.props.setInstanceId();
            }}
          >
            {<FormattedMessage id="ui-orders.itemDetails.removeBtn" />}
          </Button>
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
