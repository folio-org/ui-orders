import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { dayjs } from '@folio/stripes/components';
import {
  DATE_FORMAT,
  FieldDatepickerFinal,
} from '@folio/stripes-acq-components';

const FieldActivationDue = ({ created = '' }) => {
  return (
    <FieldDatepickerFinal
      format={(value) => {
        return Number.isInteger(value)
          ? dayjs.utc(created).add(value, 'days').format(DATE_FORMAT)
          : '';
      }}
      parse={(value) => {
        return value
          ? dayjs.utc(value).diff(dayjs(created), 'days') + 1
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

export default FieldActivationDue;
