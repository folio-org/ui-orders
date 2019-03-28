import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';

import {
  MODULE_ORDERS,
  CONFIG_CREATE_INVENTORY,
} from '../components/Utils/const';
import getCreateInventorySetting from '../components/Utils/getCreateInventorySetting';
import CreateInventoryForm from './CreateInventoryForm';
import css from './CreateInventory.css';

class CreateInventory extends Component {
  static propTypes = {
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
    const { label } = this.props;

    return (
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
    );
  }
}

export default CreateInventory;
