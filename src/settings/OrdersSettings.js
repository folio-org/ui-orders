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
import InstanceMatching from './InstanceMatching';

const sections = [
  {
    label: <FormattedMessage id="ui-orders.settings.general.label" />,
    pages: [
      {
        component: OrderApprovals,
        label: <FormattedMessage id="ui-orders.settings.approvals" />,
        route: 'approvals',
        perm: 'ui-orders.settings.view',
      },
      {
        component: ClosingReasons,
        label: <FormattedMessage id="ui-orders.settings.closingOrderReasons" />,
        route: 'closing-reasons',
        perm: 'ui-orders.settings.view',
      },
      {
        component: OrderTemplates,
        label: <FormattedMessage id="ui-orders.settings.orderTemplates" />,
        route: 'order-templates',
        perm: 'ui-orders.settings.order-templates.view',
      },
      {
        component: POLinesLimit,
        label: <FormattedMessage id="ui-orders.settings.polinesLimit" />,
        route: 'polines-limit',
        perm: 'ui-orders.settings.view',
      },
      {
        component: OpenOrder,
        label: <FormattedMessage id="ui-orders.settings.openOrder" />,
        route: 'open-order',
        perm: 'ui-orders.settings.view',
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
        perm: 'ui-orders.settings.view',
      },
      {
        component: Prefixes,
        label: <FormattedMessage id="ui-orders.settings.poNumber.prefixes" />,
        route: 'prefixes',
        perm: 'ui-orders.settings.view',
      },
      {
        component: Suffixes,
        label: <FormattedMessage id="ui-orders.settings.poNumber.suffixes" />,
        route: 'suffixes',
        perm: 'ui-orders.settings.view',
      },
    ],
  },
  {
    label: <FormattedMessage id="ui-orders.settings.inventoryInteraction.label" />,
    pages: [
      {
        component: InstanceMatching,
        label: <FormattedMessage id="ui-orders.settings.instanceMatching" />,
        route: 'instance-matching',
        perm: 'ui-orders.settings.all',
      },
      {
        component: CreateInventory,
        label: <FormattedMessage id="ui-orders.settings.inventoryInteractions" />,
        route: 'create-inventory',
        perm: 'ui-orders.settings.view',
      },
      {
        component: InstanceStatus,
        label: <FormattedMessage id="ui-orders.settings.instanceStatus" />,
        route: 'instance-status',
        perm: 'ui-orders.settings.view',
      },
      {
        component: InstanceType,
        label: <FormattedMessage id="ui-orders.settings.instanceType" />,
        route: 'instance-type',
        perm: 'ui-orders.settings.view',
      },
      {
        component: LoanType,
        label: <FormattedMessage id="ui-orders.settings.loanType" />,
        route: 'loan-type',
        perm: 'ui-orders.settings.view',
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
