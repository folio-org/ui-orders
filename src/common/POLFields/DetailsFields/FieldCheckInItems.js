import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Checkbox,
  InfoPopover,
} from '@folio/stripes/components';

const FieldCheckInItems = ({ disabled }) => {
  const label = (
    <>
      <FormattedMessage id="ui-orders.poLine.receiveItems" />
      <InfoPopover content={<FormattedMessage id="ui-orders.poLine.receiveItems.info" />} />
    </>
  );

  return (
    <Field
      component={Checkbox}
      fullWidth
      label={label}
      name="checkinItems"
      type="checkbox"
      disabled={disabled}
      vertical
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
