import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import {
  getConfigSetting,
  MODULE_ORDERS,
} from '@folio/stripes-acq-components';

import { CONFIG_INSTANCE_MATCHING } from '../../components/Utils/const';
import { InstanceMatchingForm } from './InstanceMatchingForm';

class InstanceMatching extends Component {
  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (configs) => JSON.stringify(configs);

  render() {
    const { intl, label } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.instanceMatching' })}>
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
      </TitleManager>
    );
  }
}

InstanceMatching.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(InstanceMatching);
