import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import getOrderNumberSetting from '../common/utils/getOrderNumberSetting';
import { OrdersStorageSettingsManager } from '../components/OrdersStorageSettingsManager';
import { CONFIG_ORDER_NUMBER } from '../components/Utils/const';
import OrderNumberForm from './OrderNumberForm';

import css from './ConfigManagerForm.css';

const onBeforeSave = (data) => JSON.stringify(data);

const OrderNumber = ({
  intl,
  label,
}) => {
  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.poNumber.edit' })}>
      <div
        data-test-order-settings-order-number
        className={css.formWrapper}
      >
        <OrdersStorageSettingsManager
          configName={CONFIG_ORDER_NUMBER}
          getInitialValues={getOrderNumberSetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <OrderNumberForm />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

OrderNumber.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
};

export default injectIntl(OrderNumber);
