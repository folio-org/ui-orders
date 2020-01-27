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

class ContributorForm extends Component {
  static propTypes = {
    onChangeField: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    required: true,
  };

  addFields = (fields) => {
    fields.push('');
  }

  removeFields = (fields, index) => {
    fields.remove(index);
    this.props.onChangeField();
  }

  renderForm = ({ fields }) => {
    return (
      <Row start="xs">
        <Col xs={12}>
          {fields.length === 0 && (
            <Col xs={12}>
              <div>
                <em>
                  <FormattedMessage id="ui-orders.itemDetails.addContributor" />
                </em>
              </div>
            </Col>
          )}
          {fields.map(this.renderSubForm)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button
            data-test-add-contributor-button
            onClick={() => this.addFields(fields)}
            disabled={this.props.disabled}
          >
            <FormattedMessage id="ui-orders.itemDetails.addContributorBtn" />
          </Button>
        </Col>
      </Row>
    );
  }

  renderSubForm = (elem, index, fields) => {
    const { required } = this.props;

    return (
      <Row key={index}>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.contributor" />}
            name={`${elem}.contributor`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.contributor`)}
            disabled={this.props.disabled}
          />
        </Col>
        <Col xs={5}>
          <FieldSelect
            dataOptions={this.props.contributorNameTypes}
            fullWidth
            required={required}
            label={<FormattedMessage id="ui-orders.itemDetails.contributorType" />}
            name={`${elem}.contributorNameTypeId`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.contributorNameTypeId`)}
            disabled={this.props.disabled}
          />
        </Col>
        <Col
          style={{ paddingTop: '10px' }}
          xs={1}
        >
          <br />
          <IconButton
            data-test-remove-contributor-button
            icon="trash"
            onClick={() => this.removeFields(fields, index)}
            disabled={this.props.disabled}
          >
            <FormattedMessage id="ui-orders.itemDetails.removeBtn" />
          </IconButton>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <FieldArray
        component={this.renderForm}
        name="contributors"
      />
    );
  }
}

ContributorForm.defaultProps = {
  contributorNameTypes: [],
};

export default ContributorForm;
