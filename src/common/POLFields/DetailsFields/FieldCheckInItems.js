import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { InfoPopover } from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

const options = [
  { labelId: 'ui-orders.poLine.receivingWorkflow.synchronized', value: false },
  { labelId: 'ui-orders.poLine.receivingWorkflow.independent', value: true },
];

const FieldCheckInItems = ({ disabled }) => {
  const label = (
    <>
      <FormattedMessage id="ui-orders.poLine.receivingWorkflow" />
      <InfoPopover content={<FormattedMessage id="ui-orders.poLine.receivingWorkflow.info" />} />
    </>
  );

  return (
    <FieldSelectFinal
      dataOptions={options}
      label={label}
      name="checkinItems"
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
