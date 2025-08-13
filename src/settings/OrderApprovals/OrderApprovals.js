import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { OrdersStorageSettingsManager } from '../../components/OrdersStorageSettingsManager';
import { CONFIG_APPROVALS } from '../../components/Utils/const';
import OrderApprovalsForm from './OrderApprovalsForm';

import css from '../ConfigManagerForm.css';

const onBeforeSave = (data) => JSON.stringify(data);

const OrderApprovals = ({
  intl,
  label,
}) => {
  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.approvals' })}>
      <div
        data-test-order-settings-order-approvals
        className={css.formWrapper}
      >
        <OrdersStorageSettingsManager
          configName={CONFIG_APPROVALS}
          getInitialValues={getConfigSetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <OrderApprovalsForm />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

OrderApprovals.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
};

export default injectIntl(OrderApprovals);
