import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import ReceivingLinks, { RECEIVING_HISTORY } from './ReceivingLinks';

class ReceivingHistory extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
      },
    },
  })

  static propTypes = {
    location: ReactRouterPropTypes.location,
    mutator: PropTypes.object,
  }

  onCloseReceiving = () => {
    const { location, mutator } = this.props;

    mutator.query.update({
      _path: location.pathname.replace(RECEIVING_HISTORY, ''),
    });
  }

  getFirstMenu = () => (
    <PaneMenu>
      <FormattedMessage id="ui-orders.buttons.line.close">
        {(title) => (
          <IconButton
            ariaLabel={title}
            data-test-close-button
            icon="times"
            onClick={this.onCloseReceiving}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );

  render() {
    const { mutator, location } = this.props;

    return (
      <div data-test-receiving-history>
        <Paneset>
          <Pane
            defaultWidth="fill"
            paneTitle={(
              <ReceivingLinks
                location={location}
                mutator={mutator}
              />
            )}
            firstMenu={this.getFirstMenu()}
          />
        </Paneset>
      </div>
    );
  }
}

export default ReceivingHistory;
