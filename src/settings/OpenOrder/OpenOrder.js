import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { ConfigManager } from '@folio/stripes/smart-components';
import { stripesShape, TitleManager } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import {
  MODULE_ORDERS,
  CONFIG_OPEN_ORDER,
} from '../../components/Utils/const';
import OpenOrderForm from './OpenOrderForm';

class OpenOrder extends Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (data) => JSON.stringify(data);

  render() {
    const { intl, label } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.openOrder' })}>
        <this.configManager
          configName={CONFIG_OPEN_ORDER}
          getInitialValues={getConfigSetting}
          label={label}
          moduleName={MODULE_ORDERS}
          onBeforeSave={this.beforeSave}
        >
          <div data-test-order-settings-open-order>
            <OpenOrderForm />
          </div>
        </this.configManager>
      </TitleManager>
    );
  }
}

export default injectIntl(OpenOrder);
