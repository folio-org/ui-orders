import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Checkbox } from '@folio/stripes/components';

const FieldCollection = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      id="collection"
      label={<FormattedMessage id="ui-orders.poLine.сollection" />}
      name="collection"
      type="checkbox"
      disabled={disabled}
    />
  );
};

FieldCollection.propTypes = {
  disabled: PropTypes.bool,
};

FieldCollection.defaultProps = {
  disabled: false,
};

export default FieldCollection;
