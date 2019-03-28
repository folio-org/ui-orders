import React from 'react';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Select } from '@folio/stripes/components';

import { INVENTORY_RECORDS_TYPE } from '../components/POLine/const';

const InventoryRecordTypeSelectField = ({ label, name }) => (
  <Field
    component={Select}
    fullWidth
    label={<FormattedMessage id={label} />}
    name={name}
  >
    {Object.keys(INVENTORY_RECORDS_TYPE).map((key) => (
      <FormattedMessage
        id={`ui-orders.settings.createInventory.recordType.${key}`}
        key={key}
      >
        {(message) => <option value={INVENTORY_RECORDS_TYPE[key]}>{message}</option>}
      </FormattedMessage>
    ))}
  </Field>
);

InventoryRecordTypeSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default InventoryRecordTypeSelectField;
