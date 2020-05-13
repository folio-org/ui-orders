import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { FieldSelect } from '@folio/stripes-acq-components';

import {
  ERESOURCE,
  ERESOURCES,
  OTHER,
  PE_MIX,
  PHYSICAL,
} from '../../../components/POLine/const';

export const ORDER_FORMAT = {
  electronicResource: ERESOURCE,
  physicalResource: PHYSICAL,
  PEMix: PE_MIX,
  other: OTHER,
};

const ORDER_FORMAT_OPTIONS = Object.keys(ORDER_FORMAT).map((key) => ({
  labelId: `ui-orders.order_format.${key}`,
  value: ORDER_FORMAT[key],
}));

function FieldOrderFormat({
  change,
  createInventorySetting,
  disabled,
  dispatch,
  formValues,
  required,
  vendor,
}) {
  const onChangeSelect = (_, value) => {
    dispatch(change('cost.quantityPhysical', ''));
    dispatch(change('cost.quantityElectronic', ''));
    dispatch(change('cost.listUnitPriceElectronic', ''));
    dispatch(change('cost.listUnitPrice', ''));

    if (ERESOURCES.includes(value)) {
      const activationDue = get(formValues, 'eresource.activationDue');

      if (activationDue === undefined && vendor && vendor.expectedActivationInterval) {
        dispatch(change('eresource.activationDue', vendor.expectedActivationInterval));
      }
    }

    if (value === OTHER) {
      dispatch(change('physical.createInventory', createInventorySetting.other));
    } else {
      dispatch(change('physical.createInventory', createInventorySetting.physical));
    }
  };

  return (
    <FieldSelect
      dataOptions={ORDER_FORMAT_OPTIONS}
      label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
      name="orderFormat"
      onChange={onChangeSelect}
      required={required}
      disabled={disabled}
    />
  );
}

FieldOrderFormat.propTypes = {
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  vendor: PropTypes.object,
  createInventorySetting: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

FieldOrderFormat.defaultProps = {
  required: true,
};

export default FieldOrderFormat;
