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
  Select,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../Utils/Validate';

class ContributorForm extends Component {
  static propTypes = {
    onChangeField: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
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
          {fields.length === 0 &&
            <Col xs={12}>
              <div>
                <em>
                  <FormattedMessage id="ui-orders.itemDetails.addContributor" />
                </em>
              </div>
            </Col>
          }
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
          <Field
            dataOptions={this.props.contributorNameTypes}
            component={Select}
            fullWidth
            required
            label={<FormattedMessage id="ui-orders.itemDetails.contributorType" />}
            name={`${elem}.contributorNameTypeId`}
            onChange={(e, value) => this.props.onChangeField(value, `${elem}.contributorNameTypeId`)}
            validate={Required}
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
        name="contributors"
      />
    );
  }
}

ContributorForm.defaultProps = {
  contributorNameTypes: [],
};

export default ContributorForm;
