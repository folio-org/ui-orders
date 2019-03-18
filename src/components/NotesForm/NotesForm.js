import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';

import {
  Button,
  Col,
  TextArea,
} from '@folio/stripes/components';

import { required } from '../Utils/Validate';

const renderNotesField = ({ input, label }) => (
  <Field
    component={TextArea}
    {...input}
    label={label}
  />
);

renderNotesField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.object,
};

const NotesForm = ({ fields }) => (
  <Fragment>
    {fields.map((note, index) => (
      <Fragment key={note.id || index}>
        <Col
          xs={8}
          md={10}
          lg={11}
          key={index}
        >
          <Field
            name={note}
            type="text"
            component={renderNotesField}
            validate={required}
          />
        </Col>
        <Col
          xs={4}
          md={2}
          lg={1}
        >
          <Button
            onClick={() => fields.remove(index)}
            buttonStyle="danger"
          >
            <FormattedMessage id="ui-orders.orderDetails.removeNoteBtn" />
          </Button>
        </Col>
      </Fragment>
    ))}
    <Col xs={12}>
      <Button onClick={() => fields.push('')}>
        <FormattedMessage id="ui-orders.orderDetails.addNoteBtn" />
      </Button>
    </Col>
  </Fragment>
);

NotesForm.displayName = 'NotesForm';

NotesForm.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default NotesForm;
