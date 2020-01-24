import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Checkbox,
  InfoPopover,
} from '@folio/stripes/components';

const FieldCheckInItems = ({ disabled, isPackage }) => {
  const label = isPackage
    ? (
      <Fragment>
        <FormattedMessage id="ui-orders.poLine.checkinItems.isPackage" />
        <InfoPopover content={<FormattedMessage id="ui-orders.poLine.checkinItems.isPackage.info" />} />
      </Fragment>
    )
    : <FormattedMessage id="ui-orders.poLine.checkinItems" />;

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
  isPackage: PropTypes.bool,
};

FieldCheckInItems.defaultProps = {
  disabled: false,
  isPackage: false,
};

export default FieldCheckInItems;
