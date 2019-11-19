import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ConfigManager } from '@folio/stripes/smart-components';

import { CONFIG_INSTANCE_STATUS } from '../common/constants';
import { INSTANCE_STATUSES } from '../common/resources';
import { MODULE_ORDERS } from '../components/Utils/const';
import InstanceStatusForm from './InstanceStatusForm';
import css from './CreateInventory.css';

class InstanceStatus extends Component {
  constructor(props, context) {
    super(props, context);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  render() {
    const { label, resources } = this.props;
    const instanceStatuses = get(resources, 'instanceStatuses.records', []).map(({ id, name }) => ({
      label: name,
      value: id,
    }));

    return (
      <div
        data-test-order-settings-instance-status
        className={css.formWrapper}
      >
        <this.configManager
          configName={CONFIG_INSTANCE_STATUS}
          label={label}
          moduleName={MODULE_ORDERS}
        >
          <InstanceStatusForm instanceStatuses={instanceStatuses} />
        </this.configManager>
      </div>
    );
  }
}

InstanceStatus.manifest = Object.freeze({
  instanceStatuses: INSTANCE_STATUSES,
});

InstanceStatus.propTypes = {
  label: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default InstanceStatus;
