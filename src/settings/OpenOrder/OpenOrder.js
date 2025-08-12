import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { OrdersStorageSettingsManager } from '../../components/OrdersStorageSettingsManager';
import { CONFIG_OPEN_ORDER } from '../../components/Utils/const';
import OpenOrderForm from './OpenOrderForm';

import css from '../ConfigManagerForm.css';

const onBeforeSave = (data) => JSON.stringify(data);

const OpenOrder = ({
  intl,
  label,
}) => {
  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.openOrder' })}>
      <div
        data-test-order-settings-open-order
        className={css.formWrapper}
      >
        <OrdersStorageSettingsManager
          configName={CONFIG_OPEN_ORDER}
          getInitialValues={getConfigSetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <OpenOrderForm />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

OpenOrder.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
};

export default injectIntl(OpenOrder);
