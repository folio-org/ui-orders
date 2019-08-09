import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import POLinesLimit from './POLinesLimit';
import ClosingReasons from './ClosingReasons';
import OrderNumber from './OrderNumber';
import CreateInventory from './CreateInventory';
import OrderTemplates from './OrderTemplates';
import OrderApprovals from './OrderApprovals/OrderApprovals';
import Suffixes from './Suffixes';
import Prefixes from './Prefixes';

class OrdersSettings extends Component {
  constructor(props) {
    super(props);

    this.sections = [
      {
        label: <FormattedMessage id="ui-orders.settings.general.label" />,
        pages: [
          {
            component: OrderApprovals,
            label: <FormattedMessage id="ui-orders.settings.approvals" />,
            route: 'approvals',
          },
          {
            component: ClosingReasons,
            label: <FormattedMessage id="ui-orders.settings.closingOrderReasons" />,
            route: 'closing-reasons',
          },
          {
            component: CreateInventory,
            label: <FormattedMessage id="ui-orders.settings.inventoryInteractions" />,
            route: 'create-inventory',
          },
          {
            component: OrderTemplates,
            label: <FormattedMessage id="ui-orders.settings.orderTemplates" />,
            route: 'order-templates',
          },
          {
            component: POLinesLimit,
            label: <FormattedMessage id="ui-orders.settings.polinesLimit" />,
            route: 'polines-limit',
          },
        ],
      },
      {
        label: <FormattedMessage id="ui-orders.settings.poNumber.label" />,
        pages: [
          {
            component: OrderNumber,
            label: <FormattedMessage id="ui-orders.settings.poNumber.edit" />,
            route: 'po-number',
          },
          {
            component: Prefixes,
            label: <FormattedMessage id="ui-orders.settings.poNumber.prefixes" />,
            route: 'prefixes',
          },
          {
            component: Suffixes,
            label: <FormattedMessage id="ui-orders.settings.poNumber.suffixes" />,
            route: 'suffixes',
          },
        ],
      },
    ];
  }

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={<FormattedMessage id="ui-orders.settings.index.paneTitle" />}
      />
    );
  }
}

export default OrdersSettings;
