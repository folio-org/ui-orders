import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import {
  MODULE_ORDERS,
  CONFIG_CREATE_INVENTORY,
} from '../components/Utils/const';
import getCreateInventorySetting from '../common/utils/getCreateInventorySetting';

import css from './ConfigManagerForm.css';
import CreateInventoryForm from './CreateInventoryForm';

class CreateInventory extends Component {
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

  beforeSave = (data) => {
    const {
      eresource,
      physical,
      other,
    } = data;

    return JSON.stringify({
      eresource,
      physical,
      other,
    });
  }

  render() {
    const { intl, label } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.inventoryInteractions' })}>
        <div
          data-test-order-settings-create-inventory
          className={css.formWrapper}
        >
          <this.configManager
            configName={CONFIG_CREATE_INVENTORY}
            getInitialValues={getCreateInventorySetting}
            label={label}
            moduleName={MODULE_ORDERS}
            onBeforeSave={this.beforeSave}
          >
            <CreateInventoryForm />
          </this.configManager>
        </div>
      </TitleManager>
    );
  }
}

export default injectIntl(CreateInventory);
