import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import { OrdersStorageSettingsManager } from '../../components/OrdersStorageSettingsManager';
import { CONFIG_INSTANCE_MATCHING } from '../../components/Utils/const';
import { InstanceMatchingForm } from './InstanceMatchingForm';

import css from '../ConfigManagerForm.css';

const onBeforeSave = (data) => JSON.stringify(data);

const InstanceMatching = ({
  intl,
  label,
}) => {
  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.instanceMatching' })}>
      <div className={css.formWrapper}>
        <OrdersStorageSettingsManager
          configName={CONFIG_INSTANCE_MATCHING}
          getInitialValues={getConfigSetting}
          label={label}
          onBeforeSave={onBeforeSave}
        >
          <InstanceMatchingForm />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

InstanceMatching.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
};

export default injectIntl(InstanceMatching);
