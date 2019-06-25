import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { Checkbox } from '@folio/stripes/components';

const FieldCheckInItems = ({ disabled }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.checkinItems" />}
      name="checkinItems"
      type="checkbox"
      disabled={disabled}
    />
  );
};

FieldCheckInItems.propTypes = {
  disabled: PropTypes.bool,
};

FieldCheckInItems.defaultProps = {
  disabled: false,
};

export default FieldCheckInItems;
