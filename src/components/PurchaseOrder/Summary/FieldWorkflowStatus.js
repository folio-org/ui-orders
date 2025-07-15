import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  FieldSelectFinal as FieldSelect,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../../common/constants';

const WORKFLOW_STATUS_OPTIONS = Object.keys(ORDER_STATUSES).map((key) => ({
  labelId: `ui-orders.workflowStatus.${key}`,
  value: ORDER_STATUSES[key],
}));

function FieldWorkflowStatus({
  disabled = false,
  isNonInteractive = false,
  ...rest
}) {
  return (
    <FieldSelect
      dataOptions={WORKFLOW_STATUS_OPTIONS}
      disabled={disabled}
      isNonInteractive={isNonInteractive}
      label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
      name={PO_FORM_FIELDS.workflowStatus}
      {...rest}
    />
  );
}

FieldWorkflowStatus.propTypes = {
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
};

export default FieldWorkflowStatus;
