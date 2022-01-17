import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import { Checkbox, InfoPopover } from '@folio/stripes/components';

const FieldAutomaticExport = ({ isManualOrder = false, ...props }) => {
  const label = (
    <>
      <FormattedMessage id="ui-orders.poLine.automaticExport" />
      {isManualOrder && <InfoPopover content={<FormattedMessage id="ui-orders.poLine.manualPO.info" />} />}
    </>
  );

  return (
    <Field
      component={Checkbox}
      fullWidth
      label={label}
      name="automaticExport"
      type="checkbox"
      vertical
      validateFields={[]}
      {...props}
    />
  );
};

FieldAutomaticExport.propTypes = {
  isManualOrder: PropTypes.bool.isRequired,
};

export default FieldAutomaticExport;
