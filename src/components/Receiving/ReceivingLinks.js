import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

export const RECEIVING_ITEMS = '/receiving';
export const RECEIVING_HISTORY = '/receiving-history';

class ReceivingLinks extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    location: ReactRouterPropTypes.location.isRequired,

  }

  getButtonStyle = (pathEnding) => {
    const { location } = this.props;

    return location.pathname.endsWith(pathEnding)
      ? 'primary'
      : 'default';
  };

  goToHistory = () => {
    this.handleNavigate(RECEIVING_ITEMS, RECEIVING_HISTORY);
  }

  goToItems = () => {
    this.handleNavigate(RECEIVING_HISTORY, RECEIVING_ITEMS);
  }

  handleNavigate = (from, to) => {
    const { location, mutator } = this.props;

    if (location.pathname.endsWith(to)) {
      return;
    }

    mutator.query.update({
      _path: location.pathname.replace(from, to),
    });
  };

  render() {
    return (
      <ButtonGroup>
        <Button
          buttonStyle={this.getButtonStyle(RECEIVING_ITEMS)}
          marginBottom0
          onClick={this.goToItems}
        >
          <FormattedMessage id="ui-orders.receiving.links.items" />
        </Button>
        <Button
          buttonStyle={this.getButtonStyle(RECEIVING_HISTORY)}
          marginBottom0
          onClick={this.goToHistory}
        >
          <FormattedMessage id="ui-orders.receiving.links.history" />
        </Button>
      </ButtonGroup>
    );
  }
}

export default ReceivingLinks;
