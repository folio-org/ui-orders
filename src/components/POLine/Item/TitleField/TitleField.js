import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  TextField,
  validateRequired,
} from '@folio/stripes-acq-components';

import TitleView from './TitleView';
import css from './TitleField.css';

function TitleField({ isNonInteractive, poLineDetails, required, ...rest }) {
  return isNonInteractive
    ? <TitleView poLineDetails={poLineDetails} />
    : (
      <Field
        className={css.titleWrapper}
        component={TextField}
        fullWidth
        marginBottom0
        name="titleOrPackage"
        validate={required ? validateRequired : undefined}
        validateFields={[]}
        {...rest}
      />
    );
}

TitleField.propTypes = {
  isNonInteractive: PropTypes.bool,
  poLineDetails: PropTypes.object,
  required: PropTypes.bool,
};

export default TitleField;
