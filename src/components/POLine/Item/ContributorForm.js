import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Button,
  Col,
  IconButton,
  Row,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  TextField,
} from '@folio/stripes-acq-components';

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
    const { disabled, required } = this.props;

    return (
      <Row start="xs">
        <Col xs={12}>
          {fields.length === 0 && !disabled && (
            <Col xs={12}>
              <div>
                <em>
                  <FormattedMessage id="ui-orders.itemDetails.addContributor" />
                </em>
              </div>
            </Col>
          )}
          {fields.map((elem, index) => (
            <Row key={index}>
              <Col xs={6}>
                <Field
                  component={TextField}
                  fullWidth
                  label={<FormattedMessage id="ui-orders.itemDetails.contributor" />}
                  name={`${elem}.contributor`}
                  onChange={({ target: { value } }) => this.props.onChangeField(value, `${elem}.contributor`)}
                  isNonInteractive={disabled}
                  validateFields={[`${elem}.contributorNameTypeId`]}
                  required={required}
                />
              </Col>
              <Col xs={5}>
                <FieldSelectFinal
                  dataOptions={this.props.contributorNameTypes}
                  fullWidth
                  required={required}
                  label={<FormattedMessage id="ui-orders.itemDetails.contributorType" />}
                  name={`${elem}.contributorNameTypeId`}
                  onChange={({ target: { value } }) => this.props.onChangeField(value, `${elem}.contributorNameTypeId`)}
                  isNonInteractive={disabled}
                  validateFields={[`${elem}.contributor`]}
                />
              </Col>
              {!disabled && (
                <Col
                  style={{ paddingTop: '10px' }}
                  xs={1}
                >
                  <br />
                  <IconButton
                    data-test-remove-contributor-button
                    icon="trash"
                    onClick={() => this.removeFields(fields, index)}
                    disabled={disabled}
                  >
                    <FormattedMessage id="ui-orders.itemDetails.removeBtn" />
                  </IconButton>
                </Col>
              )}
            </Row>
          ))}
        </Col>
        {!disabled && (
          <Col xs={12} style={{ paddingTop: '10px' }}>
            <Button
              data-test-add-contributor-button
              onClick={() => this.addFields(fields)}
              disabled={disabled}
            >
              <FormattedMessage id="ui-orders.itemDetails.addContributorBtn" />
            </Button>
          </Col>
        )}
      </Row>
    );
  }

  render() {
    return (
      <FieldArray
        component={this.renderForm}
        legend={<FormattedMessage id="ui-orders.itemDetails.contributors" />}
        name="contributors"
      />
    );
  }
}

ContributorForm.defaultProps = {
  contributorNameTypes: [],
};

export default ContributorForm;
