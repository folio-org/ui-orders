import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  IconButton,
  Row,
  TextArea,
} from '@folio/stripes/components';
import { validateRequired } from '@folio/stripes-acq-components';

const NotesForm = ({ fields }) => (
  <>
    {fields.map((note, index) => (
      <Row key={note.id || index}>
        <Col
          xs={11}
          key={index}
        >
          <Field
            name={note}
            type="text"
            component={TextArea}
            validate={validateRequired}
            validateFields={[]}
          />
        </Col>
        <Col xs={1}>
          <IconButton
            data-test-remove-note-button
            icon="trash"
            onClick={() => fields.remove(index)}
          >
            <FormattedMessage id="ui-orders.orderDetails.removeNoteBtn" />
          </IconButton>
        </Col>
      </Row>
    ))}
    <Col xs={12}>
      <Button
        data-test-add-note-button
        onClick={() => fields.push('')}
      >
        <FormattedMessage id="ui-orders.orderDetails.addNoteBtn" />
      </Button>
    </Col>
  </>
);

NotesForm.displayName = 'NotesForm';

NotesForm.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default NotesForm;
