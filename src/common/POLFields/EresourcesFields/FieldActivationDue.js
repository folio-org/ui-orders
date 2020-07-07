import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import {
  DATE_FORMAT,
  FieldDatepickerFinal,
} from '@folio/stripes-acq-components';

const FieldActivationDue = ({ created }) => {
  return (
    <FieldDatepickerFinal
      format={(value) => {
        return Number.isInteger(value)
          ? moment.utc(created).add(value, 'days').format(DATE_FORMAT)
          : '';
      }}
      parse={(value) => {
        return value
          ? moment.utc(value).diff(moment(created), 'days') + 1
          : undefined;
      }}
      label={<FormattedMessage id="ui-orders.eresource.activationDue" />}
      name="eresource.activationDue"
    />
  );
};

FieldActivationDue.propTypes = {
  created: PropTypes.string,
};

FieldActivationDue.defaultProps = {
  created: '',
};

export default FieldActivationDue;
