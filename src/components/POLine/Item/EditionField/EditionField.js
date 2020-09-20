import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import EditionView from './EditionView';

function EditionField({ isNonInteractive, value, ...rest }) {
  return isNonInteractive
    ? <EditionView value={value} />
    : (
      <Field
        component={TextField}
        fullWidth
        label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
        name="edition"
        validateFields={[]}
        {...rest}
      />
    );
}

EditionField.propTypes = {
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  value: PropTypes.string,
};

export default EditionField;
