import { useIntl } from 'react-intl';
import {
  Route,
  Switch,
} from 'react-router-dom';

import { CUSTOM_FIELDS_ORDERS_BACKEND_NAME } from '@folio/stripes-acq-components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  EditCustomFieldsSettings,
  ViewCustomFieldsSettings,
} from '@folio/stripes/smart-components';

import {
  ENTITY_TYPE_ORDER,
  ENTITY_TYPE_PO_LINE,
  PO_CONFIG_NAME_PREFIX,
  PO_LINE_CONFIG_NAME_PREFIX,
} from '../common/constants';

const CustomFieldsSettings = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const basePO = '/settings/orders/custom-fields-po';
  const basePOL = '/settings/orders/custom-fields-pol';

  const permissions = {
    canView: stripes.hasPerm('ui-orders.settings.custom-fields.view'),
    canEdit: stripes.hasPerm('ui-orders.settings.custom-fields.edit'),
    canDelete: stripes.hasPerm('ui-orders.settings.custom-fields.delete'),
  };

  return (
    <Switch>
      <Route exact path={basePO}>
        <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.customFields.purchaseOrders' })}>
          <ViewCustomFieldsSettings
            backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
            entityType={ENTITY_TYPE_ORDER}
            editRoute={`${basePO}/edit`}
            permissions={permissions}
            configNamePrefix={PO_CONFIG_NAME_PREFIX}
          />
        </TitleManager>
      </Route>
      <Route exact path={`${basePO}/edit`}>
        <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.customFields.purchaseOrders' })}>
          <EditCustomFieldsSettings
            backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
            entityType={ENTITY_TYPE_ORDER}
            viewRoute={basePO}
            permissions={permissions}
            configNamePrefix={PO_CONFIG_NAME_PREFIX}
          />
        </TitleManager>
      </Route>

      <Route exact path={basePOL}>
        <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.customFields.purchaseOrderLines' })}>
          <ViewCustomFieldsSettings
            backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
            entityType={ENTITY_TYPE_PO_LINE}
            editRoute={`${basePOL}/edit`}
            permissions={permissions}
            configNamePrefix={PO_LINE_CONFIG_NAME_PREFIX}
          />
        </TitleManager>
      </Route>
      <Route exact path={`${basePOL}/edit`}>
        <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.customFields.purchaseOrderLines' })}>
          <EditCustomFieldsSettings
            backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
            entityType={ENTITY_TYPE_PO_LINE}
            viewRoute={basePOL}
            permissions={permissions}
            configNamePrefix={PO_LINE_CONFIG_NAME_PREFIX}
          />
        </TitleManager>
      </Route>
    </Switch>
  );
};

export default CustomFieldsSettings;
