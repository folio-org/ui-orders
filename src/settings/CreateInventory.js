import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { CONFIG_CREATE_INVENTORY } from '../components/Utils/const';
import getCreateInventorySetting from '../common/utils/getCreateInventorySetting';
import { OrdersStorageSettingsManager } from '../components/OrdersStorageSettingsManager';
import CreateInventoryForm from './CreateInventoryForm';

import css from './ConfigManagerForm.css';

const onBeforeSave = (data) => {
  const {
    eresource,
    physical,
    other,
  } = data;

  return JSON.stringify({
    eresource,
    physical,
    other,
  });
};

const CreateInventory = ({
  intl,
  label,
}) => {
  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.inventoryInteractions' })}>
      <div
        data-test-order-settings-create-inventory
        className={css.formWrapper}
      >
        <OrdersStorageSettingsManager
          configName={CONFIG_CREATE_INVENTORY}
          getInitialValues={getCreateInventorySetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <CreateInventoryForm />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

CreateInventory.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
};

export default injectIntl(CreateInventory);
