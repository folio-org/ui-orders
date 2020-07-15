import React from 'react';
import { FieldArray } from 'react-final-form-arrays';

import NotesForm from '../../../components/NotesForm';

const FieldsNotes = () => {
  return (
    <FieldArray
      name="notes"
      component={NotesForm}
      validateFields={[]}
    />
  );
};

export default FieldsNotes;
