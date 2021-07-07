import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  FieldSelectFinal,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import {
  ERESOURCES,
} from '../../../components/POLine/const';

const ORDER_FORMAT_OPTIONS = Object.keys(ORDER_FORMATS).map((key) => ({
  labelId: `ui-orders.order_format.${key}`,
  value: ORDER_FORMATS[key],
}));

function FieldOrderFormat({
  change,
  createInventorySetting,
  disabled,
  formValues,
  required,
  vendor,
}) {
  const onChangeSelect = (event) => {
    const value = event.target.value;

    change('orderFormat', value);
    change('cost.quantityPhysical', null);
    change('cost.quantityElectronic', null);
    change('cost.listUnitPriceElectronic', null);
    change('cost.listUnitPrice', null);

    if (formValues.isPackage) {
      formValues?.locations?.map((l, i) => {
        change(`locations[${i}].quantityPhysical`, null);
        change(`locations[${i}].quantityElectronic`, null);
      });
    }

    if (ERESOURCES.includes(value)) {
      const activationDue = get(formValues, 'eresource.activationDue');

      if (activationDue === undefined && vendor && vendor.expectedActivationInterval) {
        change('eresource.activationDue', vendor.expectedActivationInterval);
      }
    }

    if (value === ORDER_FORMATS.other) {
      change('physical.createInventory', createInventorySetting.other);
    } else {
      change('physical.createInventory', createInventorySetting.physical);
    }
  };

  return (
    <FieldSelectFinal
      dataOptions={ORDER_FORMAT_OPTIONS}
      label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
      name="orderFormat"
      onChange={onChangeSelect}
      required={required}
      isNonInteractive={disabled}
    />
  );
}

FieldOrderFormat.propTypes = {
  change: PropTypes.func.isRequired,
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
