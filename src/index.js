import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { hot } from 'react-hot-loader';

import Main from './routes/Main';
import OrdersSettings from './settings';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Orders extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.connectedApp = props.stripes.connect(Main);
  }

  render() {
    if (this.props.showSettings) {
      return <OrdersSettings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={props => <this.connectedApp {...props} {...this.props} />}
        />
      </Switch>
    );
  }
}

export default hot(module)(Orders);
