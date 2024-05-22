import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  checkIfUserInCentralTenant,
  stripesShape,
} from '@folio/stripes/core';
import {
  ConsortiumLocationsContextProvider,
  LocationsContextProvider as TenantLocationsContextProvider,
  PermissionedRoute,
  useCentralOrderingSettings,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ORDER_TEMPLATES } from '../../components/Utils/resources';
import OrderTemplatesList from './OrderTemplatesList';
import OrderTemplatesEditorContainer from './OrderTemplatesEditor';
import OrderTemplateViewContainer from './OrderTemplateView';
import {
  TEMPLATES_RETURN_LINK,
  TEMPLATES_RETURN_LINK_LABEL_ID,
} from './constants';

function OrderTemplates({
  history,
  label,
  match: { path },
  resources,
  stripes,
}) {
  const sendCallout = useShowCallout();
  const closePane = useCallback(() => {
    history.push(path);
  }, [history, path]);

  const { enabled: isCentralOrderingEnabled } = useCentralOrderingSettings({
    enabled: checkIfUserInCentralTenant(stripes),
    queryKey: 'orders-templates',
  });

  const showSuccessDeleteMessage = useCallback(() => {
    sendCallout({
      type: 'success',
      message: <FormattedMessage id="ui-orders.settings.orderTemplates.remove.success" />,
    });
  }, [sendCallout]);

  const orderTemplatesList = get(resources, ['orderTemplates', 'records'], []);

  const LocationsContextProvider = isCentralOrderingEnabled
    ? ConsortiumLocationsContextProvider
    : TenantLocationsContextProvider;

  return (
    <LocationsContextProvider>
      <Switch>
        <PermissionedRoute
          exact
          path={path}
          perm="ui-orders.settings.order-templates.view"
          returnLink={TEMPLATES_RETURN_LINK}
          returnLinkLabelId={TEMPLATES_RETURN_LINK_LABEL_ID}
        >
          <OrderTemplatesList
            label={label}
            rootPath={path}
            orderTemplatesList={orderTemplatesList}
          />
        </PermissionedRoute>

        <PermissionedRoute
          exact
          path={`${path}/create`}
          perm="ui-orders.settings.order-templates.create"
          returnLink={TEMPLATES_RETURN_LINK}
          returnLinkLabelId={TEMPLATES_RETURN_LINK_LABEL_ID}
        >
          <OrderTemplatesEditorContainer
            centralOrdering={isCentralOrderingEnabled}
            close={closePane}
          />
        </PermissionedRoute>

        <PermissionedRoute
          exact
          path={`${path}/:id/view`}
          perm="ui-orders.settings.order-templates.view"
          returnLink={TEMPLATES_RETURN_LINK}
          returnLinkLabelId={TEMPLATES_RETURN_LINK_LABEL_ID}
        >
          <OrderTemplateViewContainer
            close={closePane}
            rootPath={path}
            showSuccessDeleteMessage={showSuccessDeleteMessage}
          />
        </PermissionedRoute>

        <PermissionedRoute
          exact
          path={`${path}/:id/edit`}
          perm="ui-orders.settings.order-templates.edit"
          returnLink={TEMPLATES_RETURN_LINK}
          returnLinkLabelId={TEMPLATES_RETURN_LINK_LABEL_ID}
        >
          <OrderTemplatesEditorContainer
            centralOrdering={isCentralOrderingEnabled}
            close={closePane}
          />
        </PermissionedRoute>
      </Switch>
    </LocationsContextProvider>
  );
}

OrderTemplates.manifest = Object.freeze({
  orderTemplates: ORDER_TEMPLATES,
});

OrderTemplates.propTypes = {
  label: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default OrderTemplates;
