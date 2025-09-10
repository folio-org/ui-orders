import PropTypes from 'prop-types';
import { useField } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal,
  PAYMENT_STATUS,
} from '@folio/stripes-acq-components';

import {
  PO_WORKFLOW_STATUSES,
  POL_FORM_FIELDS,
} from '../../constants';

const PAYMENT_STATUSES_BY_ORDER_STATUS = {
  [PO_WORKFLOW_STATUSES.pending]: [
    'pending',
    'paymentNotRequired',
  ],
  [PO_WORKFLOW_STATUSES.open]: [
    'partiallyPaid',
    'paymentNotRequired',
    'fullyPaid',
    'cancelled',
  ],
  [PO_WORKFLOW_STATUSES.closed]: [
    'cancelled',
  ],
  template: [
    'paymentNotRequired',
  ],
};

const FieldPaymentStatus = ({ workflowStatus }) => {
  const { meta: { initial } } = useField(POL_FORM_FIELDS.paymentStatus);
  const statuses = Object.keys(PAYMENT_STATUS)
    .filter(key => {
      return (PAYMENT_STATUSES_BY_ORDER_STATUS[workflowStatus] || []).includes(key) || PAYMENT_STATUS[key] === initial;
    })
    .map(key => ({
      labelId: `ui-orders.payment_status.${key}`,
      value: PAYMENT_STATUS[key],
    }));

  return (
    <FieldSelectFinal
      dataOptions={statuses}
      label={<FormattedMessage id="ui-orders.poLine.paymentStatus" />}
      name={POL_FORM_FIELDS.paymentStatus}
      disabled={!statuses.length}
    />
  );
};

FieldPaymentStatus.propTypes = {
  workflowStatus: PropTypes.string,
};

export default FieldPaymentStatus;
