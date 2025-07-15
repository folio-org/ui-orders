import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import NotesForm from '../../../components/NotesForm';
import { PO_FORM_FIELDS } from '../../constants';

const FieldsNotes = ({ required = false }) => {
  return (
    <FieldArray
      name={PO_FORM_FIELDS.notes}
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
