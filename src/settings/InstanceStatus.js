import get from 'lodash/get';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import React, { Component } from 'react';

import { TitleManager } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { CONFIG_INSTANCE_STATUS } from '../common/constants';
import { INSTANCE_STATUSES } from '../common/resources';
import { MODULE_ORDERS } from '../components/Utils/const';
import InstanceStatusForm from './InstanceStatusForm';

import css from './ConfigManagerForm.css';

class InstanceStatus extends Component {
  constructor(props, context) {
    super(props, context);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  render() {
    const {
      intl,
      label,
      resources,
    } = this.props;

    const instanceStatuses = get(resources, 'instanceStatuses.records', []).map(({ code, name }) => ({
      label: name,
      value: code,
    }));

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.instanceStatus' })}>
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
      </TitleManager>
    );
  }
}

InstanceStatus.manifest = Object.freeze({
  instanceStatuses: INSTANCE_STATUSES,
});

InstanceStatus.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(InstanceStatus);
