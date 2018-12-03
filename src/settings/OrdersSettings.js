import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import POLinesLimit from './POLinesLimit';

class OrdersSettings extends Component {
  constructor(props) {
    super(props);

    this.pages = [
      {
        component: POLinesLimit,
        label: <FormattedMessage id="ui-orders.settings.polines-limit" />,
        route: 'polines-limit',
      },
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={<FormattedMessage id="ui-orders.settings.index.paneTitle" />}
      />
    );
  }
}

export default OrdersSettings;
