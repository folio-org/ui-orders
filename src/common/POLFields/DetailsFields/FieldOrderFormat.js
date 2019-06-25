import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { get } from 'lodash';

import { Select } from '@folio/stripes/components';

import { Required } from '../../../components/Utils/Validate';
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

class FieldOrderFormat extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    orderVendorId: PropTypes.string,
    formValues: PropTypes.object.isRequired,
    vendors: PropTypes.arrayOf(PropTypes.object),
    createInventorySetting: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    vendors: [],
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
    return (
      <Field
        component={Select}
        label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
        name="orderFormat"
        onChange={this.onChangeSelect}
        required
        validate={[Required]}
        disabled={this.props.disabled}
      >
        <FormattedMessage id="ui-orders.dropdown.select">
          {(message) => <option value="">{message}</option>}
        </FormattedMessage>
        {Object.keys(ORDER_FORMAT).map((key) => (
          <FormattedMessage
            id={`ui-orders.order_format.${key}`}
            key={key}
          >
            {(message) => <option value={ORDER_FORMAT[key]}>{message}</option>}
          </FormattedMessage>
        ))}
      </Field>
    );
  }
}

export default FieldOrderFormat;
