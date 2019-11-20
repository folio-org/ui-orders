import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ConfigManager } from '@folio/stripes/smart-components';
import { Selection } from '@folio/stripes/components';

import { CONFIG_INSTANCE_TYPE } from '../../common/constants';
import { INSTANCE_TYPES } from '../../common/resources';
import { MODULE_ORDERS } from '../../components/Utils/const';
import InstanceTypeForm from './InstanceTypeForm';
import css from '../CreateInventory.css';

class InstanceType extends Component {
  constructor(props, context) {
    super(props, context);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  render() {
    const { label, resources } = this.props;
    const instanceTypes = get(resources, 'instanceTypes.records', []).map(({ code, name }) => ({
      label: name,
      value: code,
    }));

    return (
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
    );
  }
}

InstanceType.manifest = Object.freeze({
  instanceTypes: INSTANCE_TYPES,
});

InstanceType.propTypes = {
  label: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default InstanceType;
