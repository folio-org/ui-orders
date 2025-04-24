import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { MODULE_ORDERS } from '../components/Utils/const';
import getOrderNumberSetting from '../common/utils/getOrderNumberSetting';
import OrderNumberForm from './OrderNumberForm';

import css from './ConfigManagerForm.css';

class OrderNumber extends Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
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
    const { intl, label } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.poNumber.edit' })}>
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
      </TitleManager>
    );
  }
}

export default injectIntl(OrderNumber);
