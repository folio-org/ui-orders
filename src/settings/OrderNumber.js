import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';

import { MODULE_ORDERS } from '../components/Utils/const';
import getOrderNumberSetting from '../common/utils/getOrderNumberSetting';
import OrderNumberForm from './OrderNumberForm';

import css from './ConfigManagerForm.css';

class OrderNumber extends Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (canUserEditOrderNumber) => (
    JSON.stringify(canUserEditOrderNumber)
  )

  render() {
    const { label } = this.props;

    return (
      <div
        data-test-order-settings-order-number
        className={css.formWrapper}
      >
        <this.configManager
          configName="orderNumber"
          getInitialValues={getOrderNumberSetting}
          label={label}
          moduleName={MODULE_ORDERS}
          onBeforeSave={this.beforeSave}
        >
          <OrderNumberForm />
        </this.configManager>
      </div>
    );
  }
}

export default OrderNumber;
