import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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

const NotesForm = ({ fields, required }) => {
  const intl = useIntl();
  const noteLabel = intl.formatMessage({ id: 'ui-orders.order.notes' });

  return (
    <>
      {fields.map((note, index) => (
        <Row key={note.id || index}>
          <Col
            xs={11}
            key={index}
          >
            <Field
              aria-label={noteLabel}
              name={note}
              type="text"
              component={TextArea}
              validate={required ? validateRequired : undefined}
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
};

NotesForm.displayName = 'NotesForm';

NotesForm.propTypes = {
  fields: PropTypes.object.isRequired,
  required: PropTypes.bool,
};

export default NotesForm;
