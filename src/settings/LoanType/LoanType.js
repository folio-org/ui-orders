import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import {
  CONFIG_LOAN_TYPE,
  LOAN_TYPES,
  MODULE_ORDERS,
} from '@folio/stripes-acq-components';

import LoanTypeForm from './LoanTypeForm';

import css from '../ConfigManagerForm.css';

class LoanType extends Component {
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

    const loanTypes = get(resources, 'loanTypes.records', []).map(({ name }) => ({
      label: name,
      value: name,
    }));

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.loanType' })}>
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
      </TitleManager>
    );
  }
}

LoanType.manifest = Object.freeze({
  loanTypes: LOAN_TYPES,
});

LoanType.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default injectIntl(LoanType);
