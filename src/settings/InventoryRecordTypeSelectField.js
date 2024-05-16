import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { FieldSelect, FieldSelectFinal } from '@folio/stripes-acq-components';
import {
  INVENTORY_RECORDS_TYPE_FOR_SELECT,
  OPTION_VALUE_WITH_BINDARY_ACTIVE,
} from '../components/POLine/const';

const InventoryRecordTypeSelectField = ({
  label,
  disabled,
  isRedux,
  isBindaryActive = false,
  name,
  onChange,
  ...rest
}) => {
  const FieldComponent = isRedux ? FieldSelect : FieldSelectFinal;

  useEffect(() => {
    if (isBindaryActive && onChange) {
      onChange(name, OPTION_VALUE_WITH_BINDARY_ACTIVE);
    }
  }, [isBindaryActive, name, onChange, rest]);

  return (
    <FieldComponent
      dataOptions={INVENTORY_RECORDS_TYPE_FOR_SELECT}
      fullWidth
      name={name}
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
  onChange: PropTypes.func,
};

export default InventoryRecordTypeSelectField;
