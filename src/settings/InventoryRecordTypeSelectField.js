import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect, FieldSelectFinal } from '@folio/stripes-acq-components';
import {
  INVENTORY_RECORDS_TYPE_FOR_SELECT,
  OPTION_WITH_BINDARY_ACTIVE,
} from '../components/POLine/const';

const InventoryRecordTypeSelectField = ({
  label,
  disabled,
  isRedux,
  isBindaryActive = false,
  ...rest
}) => {
  const FieldComponent = isRedux ? FieldSelect : FieldSelectFinal;
  const dataOptions = isBindaryActive ? OPTION_WITH_BINDARY_ACTIVE : INVENTORY_RECORDS_TYPE_FOR_SELECT;

  return (
    <FieldComponent
      dataOptions={dataOptions}
      fullWidth
      label={<FormattedMessage id={label} />}
      disabled={disabled || isBindaryActive}
      {...rest}
    />
  );
};

InventoryRecordTypeSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isBindaryActive: PropTypes.bool,
  isRedux: PropTypes.bool,
};

export default InventoryRecordTypeSelectField;
