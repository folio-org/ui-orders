import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import NotesForm from '../../../components/NotesForm';

const FieldsNotes = ({ required }) => {
  return (
    <FieldArray
      name="notes"
      component={NotesForm}
      validateFields={[]}
      required={required}
    />
  );
};

FieldsNotes.propTypes = {
  required: PropTypes.bool,
};

export default FieldsNotes;
