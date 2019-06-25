import React, { Component, Fragment } from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';

import {
  SUFFIXES_SETTING,
  PREFIXES_SETTING,
} from '../../components/Utils/resources';
import OrderTemplatesList from './OrderTemplatesList';
import OrderTemplatesEditorContainer from './OrderTemplatesEditor';
import OrderTemplateViewContainer from './OrderTemplateView';

class OrderTemplates extends Component {
  static manifest = Object.freeze({
    prefixesSetting: PREFIXES_SETTING,
    suffixesSetting: SUFFIXES_SETTING,
  });

  static propTypes = {
    label: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);

    const { stripes } = props;

    this.connectedOrderTemplatesList = stripes.connect(OrderTemplatesList);
    this.connectedOrderTemplatesEditor = stripes.connect(OrderTemplatesEditorContainer);
    this.connectedOrderTemplateView = stripes.connect(OrderTemplateViewContainer);
    this.callout = React.createRef();
  }

  closePane = () => {
    const { history, match: { path } } = this.props;

    history.push(path);
  }

  showSuccessDeleteMessage = () => {
    this.callout.current.sendCallout({
      type: 'success',
      message: <FormattedMessage id="ui-orders.settings.orderTemplates.remove.success" />,
    });
  }

  render() {
    const { label, match: { path } } = this.props;

    return (
      <Fragment>
        <Switch>
          <Route
            exact
            path={path}
            render={() => (
              <this.connectedOrderTemplatesList
                label={label}
                rootPath={path}
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
        <Callout ref={this.callout} />
      </Fragment>
    );
  }
}

export default OrderTemplates;
