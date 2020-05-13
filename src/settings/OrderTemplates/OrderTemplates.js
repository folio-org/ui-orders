import React, { Component } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  CalloutContext,
  stripesShape,
} from '@folio/stripes/core';

import { ORDER_TEMPLATES } from '../../components/Utils/resources';
import OrderTemplatesList from './OrderTemplatesList';
import OrderTemplatesEditorContainer from './OrderTemplatesEditor';
import OrderTemplateViewContainer from './OrderTemplateView';

class OrderTemplates extends Component {
  static contextType = CalloutContext;
  static manifest = Object.freeze({
    orderTemplates: ORDER_TEMPLATES,
  });

  static propTypes = {
    label: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    stripes: stripesShape.isRequired,
    resources: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    const { stripes } = props;

    this.connectedOrderTemplatesList = stripes.connect(OrderTemplatesList);
    this.connectedOrderTemplatesEditor = stripes.connect(OrderTemplatesEditorContainer);
    this.connectedOrderTemplateView = stripes.connect(OrderTemplateViewContainer);
  }

  closePane = () => {
    const { history, match: { path } } = this.props;

    history.push(path);
  }

  showSuccessDeleteMessage = () => {
    if (this.context) {
      this.context.sendCallout({
        type: 'success',
        message: <FormattedMessage id="ui-orders.settings.orderTemplates.remove.success" />,
      });
    }
  }

  render() {
    const { label, match: { path }, resources } = this.props;
    const orderTemplatesList = get(resources, ['orderTemplates', 'records'], []);

    return (
      <Switch>
        <Route
          exact
          path={path}
          render={() => (
            <this.connectedOrderTemplatesList
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
            <this.connectedOrderTemplatesEditor
              {...props}
              close={this.closePane}
            />
          )}
        />
        <Route
          path={`${path}/:id/view`}
          render={(props) => (
            <this.connectedOrderTemplateView
              {...props}
              close={this.closePane}
              rootPath={path}
              showSuccessDeleteMessage={this.showSuccessDeleteMessage}
            />
          )}
        />
        <Route
          exact
          path={`${path}/:id/edit`}
          render={(props) => (
            <this.connectedOrderTemplatesEditor
              {...props}
              close={this.closePane}
            />
          )}
        />
      </Switch>
    );
  }
}

export default OrderTemplates;
