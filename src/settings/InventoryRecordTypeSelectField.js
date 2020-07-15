import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect, FieldSelectFinal } from '@folio/stripes-acq-components';
import { INVENTORY_RECORDS_TYPE_FOR_SELECT } from '../components/POLine/const';

const InventoryRecordTypeSelectField = ({ label, name, disabled, isRedux, ...rest }) => {
  const FieldComponent = isRedux ? FieldSelect : FieldSelectFinal;

  return (
    <FieldComponent
      dataOptions={INVENTORY_RECORDS_TYPE_FOR_SELECT}
      fullWidth
      label={<FormattedMessage id={label} />}
      name={name}
      disabled={disabled}
      {...rest}
    />
  );
};

InventoryRecordTypeSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isRedux: PropTypes.bool,
};

export default InventoryRecordTypeSelectField;
