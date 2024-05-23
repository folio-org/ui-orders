import {
  Route,
  Switch,
} from 'react-router-dom';

import { CUSTOM_FIELDS_ORDERS_BACKEND_NAME } from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';
import {
  EditCustomFieldsSettings,
  ViewCustomFieldsSettings,
} from '@folio/stripes/smart-components';

import {
  ENTITY_TYPE_ORDER,
  ENTITY_TYPE_PO_LINE,
} from '../common/constants';

const CustomFieldsSettings = () => {
  const stripes = useStripes();

  const basePO = '/settings/orders/custom-fields-po';
  const basePOL = '/settings/orders/custom-fields-pol';

  const permissions = {
    canView: stripes.hasPerm('ui-orders.settings.custom-fields.view'),
    editable: stripes.hasPerm('ui-orders.settings.custom-fields.edit'),
    canDelete: stripes.hasPerm('ui-orders.settings.custom-fields.delete'),
  };

  return (
    <Switch>
      <Route exact path={basePO}>
        <ViewCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={ENTITY_TYPE_ORDER}
          editRoute={`${basePO}/edit`}
          permissions={permissions}
        />
      </Route>
      <Route exact path={`${basePO}/edit`}>
        <EditCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={ENTITY_TYPE_ORDER}
          viewRoute={basePO}
          permissions={permissions}
        />
      </Route>
      <Route exact path={basePOL}>
        <ViewCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={ENTITY_TYPE_PO_LINE}
          editRoute={`${basePOL}/edit`}
          permissions={permissions}
        />
      </Route>
      <Route exact path={`${basePOL}/edit`}>
        <EditCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={ENTITY_TYPE_PO_LINE}
          viewRoute={basePOL}
          permissions={permissions}
        />
      </Route>
    </Switch>
  );
};

export default CustomFieldsSettings;
