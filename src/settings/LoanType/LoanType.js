import get from 'lodash/get';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import {
  CONFIG_LOAN_TYPE,
  LOAN_TYPES,
} from '@folio/stripes-acq-components';

import { OrdersStorageSettingsManager } from '../../components/OrdersStorageSettingsManager';
import LoanTypeForm from './LoanTypeForm';

import css from '../ConfigManagerForm.css';

const LoanType = ({
  intl,
  label,
  resources,
}) => {
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
        <OrdersStorageSettingsManager
          configName={CONFIG_LOAN_TYPE}
          label={label}
        >
          <LoanTypeForm loanTypes={loanTypes} />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

LoanType.manifest = Object.freeze({
  loanTypes: LOAN_TYPES,
});

LoanType.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
  resources: PropTypes.shape({
    loanTypes: {
      records: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
      })),
    },
  }).isRequired,
};

export default injectIntl(LoanType);
