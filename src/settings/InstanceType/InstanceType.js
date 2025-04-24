import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { CONFIG_INSTANCE_TYPE } from '../../common/constants';
import { INSTANCE_TYPES } from '../../common/resources';
import { MODULE_ORDERS } from '../../components/Utils/const';
import InstanceTypeForm from './InstanceTypeForm';

import css from '../ConfigManagerForm.css';

class InstanceType extends Component {
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

    const instanceTypes = get(resources, 'instanceTypes.records', []).map(({ code, name }) => ({
      label: name,
      value: code,
    }));

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.instanceType' })}>
        <div
          data-test-order-settings-instance-type
          className={css.formWrapper}
        >
          <this.configManager
            configName={CONFIG_INSTANCE_TYPE}
            label={label}
            moduleName={MODULE_ORDERS}
          >
            <InstanceTypeForm instanceTypes={instanceTypes} />
          </this.configManager>
        </div>
      </TitleManager>
    );
  }
}

InstanceType.manifest = Object.freeze({
  instanceTypes: INSTANCE_TYPES,
});

InstanceType.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(InstanceType);
