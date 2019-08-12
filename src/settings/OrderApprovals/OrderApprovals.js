import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ConfigManager } from '@folio/stripes/smart-components';

import {
  MODULE_ORDERS,
} from '../../components/Utils/const';
import getApprovalsSetting from '../../common/utils/getApprovalsSetting';
import OrderApprovalsForm from './OrderApprovalsForm';
import css from './OrderApprovals.css';

class OrderApprovals extends Component {
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
        data-test-order-settings-order-approvals
        className={css.formWrapper}
      >
        <this.configManager
          configName="approvals"
          getInitialValues={getApprovalsSetting}
          label={label}
          moduleName={MODULE_ORDERS}
          onBeforeSave={this.beforeSave}
        >
          <OrderApprovalsForm />
        </this.configManager>
      </div>
    );
  }
}

export default OrderApprovals;
