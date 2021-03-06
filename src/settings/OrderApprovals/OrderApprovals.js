import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';
import { getConfigSetting } from '@folio/stripes-acq-components';

import {
  MODULE_ORDERS,
  CONFIG_APPROVALS,
} from '../../components/Utils/const';

import OrderApprovalsForm from './OrderApprovalsForm';

class OrderApprovals extends Component {
  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  beforeSave = (isApprovalRequired) => JSON.stringify(isApprovalRequired);

  render() {
    const { label } = this.props;

    return (
      <this.configManager
        data-test-order-settings-order-approvals
        configName={CONFIG_APPROVALS}
        getInitialValues={getConfigSetting}
        label={label}
        moduleName={MODULE_ORDERS}
        onBeforeSave={this.beforeSave}
      >
        <div data-test-order-settings-order-approvals>
          <OrderApprovalsForm />
        </div>
      </this.configManager>
    );
  }
}

OrderApprovals.propTypes = {
  label: PropTypes.node.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default OrderApprovals;
