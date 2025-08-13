import get from 'lodash/get';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { CONFIG_INSTANCE_STATUS } from '../common/constants';
import { INSTANCE_STATUSES } from '../common/resources';
import { OrdersStorageSettingsManager } from '../components/OrdersStorageSettingsManager';
import InstanceStatusForm from './InstanceStatusForm';

import css from './ConfigManagerForm.css';

const InstanceStatus = ({
  intl,
  label,
  resources,
}) => {
  const instanceStatuses = get(resources, 'instanceStatuses.records', []).map(({ code, name }) => ({
    label: name,
    value: code,
  }));

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.instanceStatus' })}>
      <div
        data-test-order-settings-instance-status
        className={css.formWrapper}
      >
        <OrdersStorageSettingsManager
          configName={CONFIG_INSTANCE_STATUS}
          label={label}
        >
          <InstanceStatusForm instanceStatuses={instanceStatuses} />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

InstanceStatus.manifest = Object.freeze({
  instanceStatuses: INSTANCE_STATUSES,
});

InstanceStatus.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
  resources: PropTypes.shape({
    instanceStatuses: {
      records: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
      })),
    },
  }).isRequired,
};

export default injectIntl(InstanceStatus);
