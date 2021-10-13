import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';
import {
  getConfigSetting,
  MODULE_ORDERS,
} from '@folio/stripes-acq-components';

import {
  CONFIG_INSTANCE_MATCHING,
} from '../../components/Utils/const';

import { InstanceMatchingForm } from './InstanceMatchingForm';

class InstanceMatching extends Component {
  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (configs) => JSON.stringify(configs);

  render() {
    const { label } = this.props;

    return (
      <this.configManager
        configName={CONFIG_INSTANCE_MATCHING}
        getInitialValues={getConfigSetting}
        label={label}
        moduleName={MODULE_ORDERS}
        onBeforeSave={this.beforeSave}
        formType="final-form"
      >
        <InstanceMatchingForm />
      </this.configManager>
    );
  }
}

InstanceMatching.propTypes = {
  label: PropTypes.node.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default InstanceMatching;
