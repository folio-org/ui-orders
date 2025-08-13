import get from 'lodash/get';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { CONFIG_INSTANCE_TYPE } from '../../common/constants';
import { INSTANCE_TYPES } from '../../common/resources';
import { OrdersStorageSettingsManager } from '../../components/OrdersStorageSettingsManager';
import InstanceTypeForm from './InstanceTypeForm';

import css from '../ConfigManagerForm.css';

const InstanceType = ({
  intl,
  label,
  resources,
}) => {
  const instanceTypes = get(resources, 'instanceTypes.records', []).map(({ code, name }) => ({
    label: name,
    value: code,
  }));

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.instanceType' })}>
      <div
        data-test-order-settings-instance-type
        className={css.formWrapper}
      >
        <OrdersStorageSettingsManager
          configName={CONFIG_INSTANCE_TYPE}
          label={label}
        >
          <InstanceTypeForm instanceTypes={instanceTypes} />
        </OrdersStorageSettingsManager>
      </div>
    </TitleManager>
  );
};

InstanceType.manifest = Object.freeze({
  instanceTypes: INSTANCE_TYPES,
});

InstanceType.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
  resources: PropTypes.shape({
    instanceTypes: {
      records: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
      })),
    },
  }).isRequired,
};

export default injectIntl(InstanceType);
