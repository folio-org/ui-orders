import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import POLinesLimit from './POLinesLimit';
import ClosingReasons from './ClosingReasons';
import OrderNumber from './OrderNumber';
import CreateInventory from './CreateInventory';
import OrderTemplates from './OrderTemplates';
import OrderApprovals from './OrderApprovals';
import OpenOrder from './OpenOrder';
import Suffixes from './Suffixes';
import Prefixes from './Prefixes';
import InstanceStatus from './InstanceStatus';
import InstanceType from './InstanceType';
import LoanType from './LoanType';

const sections = [
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
        component: InstanceStatus,
        label: <FormattedMessage id="ui-orders.settings.instanceStatus" />,
        route: 'instance-status',
      },
      {
        component: InstanceType,
        label: <FormattedMessage id="ui-orders.settings.instanceType" />,
        route: 'instance-type',
      },
      {
        component: LoanType,
        label: <FormattedMessage id="ui-orders.settings.loanType" />,
        route: 'loan-type',
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
      {
        component: OpenOrder,
        label: <FormattedMessage id="ui-orders.settings.openOrder" />,
        route: 'open-order',
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

const OrdersSettings = (props) => {
  return (
    <Settings
      {...props}
      sections={sections}
      paneTitle={<FormattedMessage id="ui-orders.settings.index.paneTitle" />}
    />
  );
};

export default OrdersSettings;
