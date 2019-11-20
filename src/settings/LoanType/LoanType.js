import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ConfigManager } from '@folio/stripes/smart-components';

import { CONFIG_LOAN_TYPE } from '../../common/constants';
import { LOAN_TYPES } from '../../common/resources';
import { MODULE_ORDERS } from '../../components/Utils/const';
import LoanTypeForm from './LoanTypeForm';
import css from '../CreateInventory.css';

class LoanType extends Component {
  constructor(props, context) {
    super(props, context);

    this.configManager = props.stripes.connect(ConfigManager);
  }

  render() {
    const { label, resources } = this.props;
    const loanTypes = get(resources, 'loanTypes.records', []).map(({ name }) => ({
      label: name,
      value: name,
    }));

    return (
      <div
        data-test-order-settings-loan-type
        className={css.formWrapper}
      >
        <this.configManager
          configName={CONFIG_LOAN_TYPE}
          label={label}
          moduleName={MODULE_ORDERS}
        >
          <LoanTypeForm loanTypes={loanTypes} />
        </this.configManager>
      </div>
    );
  }
}

LoanType.manifest = Object.freeze({
  loanTypes: LOAN_TYPES,
});

LoanType.propTypes = {
  label: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default LoanType;
