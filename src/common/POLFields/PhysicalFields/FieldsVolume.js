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

class FieldsVolume extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
  };

  addFields = (fields) => {
    fields.push('');
  }

  removeFields = (fields, index) => {
    fields.remove(index);
  }

  renderForm = ({ fields }) => {
    const { disabled } = this.props;

    return (
      <Row>
        <Col xs={12}>
          {fields.length === 0 && (
            <Col xs={12}>
              <div>
                <em>
                  <FormattedMessage id="ui-orders.physical.addVolume" />
                </em>
              </div>
            </Col>
          )}
          {fields.map(this.renderSubForm)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button
            data-test-add-volume-button
            onClick={() => this.addFields(fields)}
            disabled={disabled}
          >
            <FormattedMessage id="ui-orders.physical.addVolumeBtn" />
          </Button>
        </Col>
      </Row>
    );
  }

  renderSubForm = (elem, index, fields) => {
    const { disabled } = this.props;

    return (
      <Row key={index}>
        <Col xs={11}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.physical.volume" />}
            name={elem}
            disabled={disabled}
          />
        </Col>
        <Col
          style={{ paddingTop: '10px' }}
          xs={1}
        >
          <br />
          <IconButton
            data-test-remove-volume-button
            icon="trash"
            onClick={() => this.removeFields(fields, index)}
            disabled={disabled}
          >
            <FormattedMessage id="ui-orders.physical.removeBtn" />
          </IconButton>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <FieldArray
        component={this.renderForm}
        label="physical.volumes"
        name="physical.volumes"
      />
    );
  }
}

export default FieldsVolume;
