import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
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
    const { intl, label } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.approvals' })}>
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
      </TitleManager>
    );
  }
}

OrderApprovals.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(OrderApprovals);
