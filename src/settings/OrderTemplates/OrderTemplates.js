import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import OrderTemplatesList from './OrderTemplatesList';
import OrderTemplatesEditor from './OrderTemplatesEditor';

const OrderTemplates = ({ match, label }) => {
  const { path } = match;

  return (
    <Switch>
      <Route
        exact
        path={path}
        render={() => (
          <OrderTemplatesList
            label={label}
            rootPath={path}
          />
        )}
      />
      <Route
        exact
        path={`${path}/create`}
        render={() => <OrderTemplatesEditor />}
      />
    </Switch>
  );
};

OrderTemplates.propTypes = {
  label: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default OrderTemplates;
