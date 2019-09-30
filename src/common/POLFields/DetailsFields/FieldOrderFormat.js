import React, { Component } from 'react';
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

class FieldOrderFormat extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    orderVendorId: PropTypes.string,
    formValues: PropTypes.object.isRequired,
    vendors: PropTypes.arrayOf(PropTypes.object),
    createInventorySetting: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
  }

  static defaultProps = {
    vendors: [],
    required: true,
  };

  onChangeSelect = (_, value) => {
    const {
      dispatch,
      change,
      createInventorySetting,
      vendors,
      orderVendorId,
      formValues,
    } = this.props;

    dispatch(change('cost.quantityPhysical', ''));
    dispatch(change('cost.quantityElectronic', ''));
    dispatch(change('cost.listUnitPriceElectronic', ''));
    dispatch(change('cost.listUnitPrice', ''));

    if (ERESOURCES.includes(value)) {
      const activationDue = get(formValues, 'eresource.activationDue');
      const vendor = vendors.find(v => v.id === orderVendorId);

      if (activationDue === undefined && vendor && vendor.expectedActivationInterval) {
        dispatch(change('eresource.activationDue', vendor.expectedActivationInterval));
      }
    }

    if (value === OTHER) {
      dispatch(change('physical.createInventory', createInventorySetting.other));
    } else {
      dispatch(change('physical.createInventory', createInventorySetting.physical));
    }
  }

  render() {
    const {
      disabled,
      required,
    } = this.props;

    return (
      <FieldSelect
        dataOptions={ORDER_FORMAT_OPTIONS}
        label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
        name="orderFormat"
        onChange={this.onChangeSelect}
        required={required}
        disabled={disabled}
      />
    );
  }
}

export default FieldOrderFormat;
