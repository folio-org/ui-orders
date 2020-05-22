import React, { useCallback } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { useShowCallout } from '@folio/stripes-acq-components';

import { ORDER_TEMPLATES } from '../../components/Utils/resources';
import OrderTemplatesList from './OrderTemplatesList';
import OrderTemplatesEditorContainer from './OrderTemplatesEditor';
import OrderTemplateViewContainer from './OrderTemplateView';

function OrderTemplates({ history, label, match: { path }, resources }) {
  const sendCallout = useShowCallout();
  const closePane = useCallback(() => {
    history.push(path);
  }, [history, path]);

  const showSuccessDeleteMessage = useCallback(() => {
    sendCallout({
      type: 'success',
      message: <FormattedMessage id="ui-orders.settings.orderTemplates.remove.success" />,
    });
  }, [sendCallout]);

  const orderTemplatesList = get(resources, ['orderTemplates', 'records'], []);

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={() => (
          <OrderTemplatesList
            label={label}
            rootPath={path}
            orderTemplatesList={orderTemplatesList}
          />
        )}
      />
      <Route
        exact
        path={`${path}/create`}
        render={(props) => (
          <OrderTemplatesEditorContainer
            {...props}
            close={closePane}
          />
        )}
      />
      <Route
        path={`${path}/:id/view`}
        render={(props) => (
          <OrderTemplateViewContainer
            {...props}
            close={closePane}
            rootPath={path}
            showSuccessDeleteMessage={showSuccessDeleteMessage}
          />
        )}
      />
      <Route
        exact
        path={`${path}/:id/edit`}
        render={(props) => (
          <OrderTemplatesEditorContainer
            {...props}
            close={closePane}
          />
        )}
      />
    </Switch>
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
};

export default OrderTemplates;
