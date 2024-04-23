import { FormattedMessage } from 'react-intl';

import AcquisitionMethods from './AcquisitionMethods';
import { CentralOrdering } from './CentralOrdering';
import ClosingReasons from './ClosingReasons';
import CreateInventory from './CreateInventory';
import CustomFieldsSettings from './CustomFieldsSettings';
import InstanceMatching from './InstanceMatching';
import InstanceStatus from './InstanceStatus';
import InstanceType from './InstanceType';
import LoanType from './LoanType';
import OpenOrder from './OpenOrder';
import OrderApprovals from './OrderApprovals';
import OrderNumber from './OrderNumber';
import OrderTemplates from './OrderTemplates';
import POLinesLimit from './POLinesLimit';
import Prefixes from './Prefixes';
import { RoutingAddress } from './RoutingAddress';
import RoutingListConfiguration from './RoutingListConfiguration';
import Suffixes from './Suffixes';
import { SECTION_KEYS } from './constants';
import { SETTINGS_SECTION_KEY_FIELD_NAME } from './hooks';

/*
  The sections of the order settings can dynamically change depending on other settings.
  So, two internal fields are used to control access to the sections and their order: `SETTINGS_SECTION_KEY_FIELD_NAME` and `SETTINGS_SECTION_ORDER_FIELD_NAME`.

  `SETTINGS_SECTION_KEY_FIELD_NAME` contains the section identifier, with which it's possible to find this section in the array;
  `SETTINGS_SECTION_ORDER_FIELD_NAME` allows to set the order (in numerical form) of displaying sections in the settings.
 */

export const NETWORK_ORDERING_SECTION = {
  [SETTINGS_SECTION_KEY_FIELD_NAME]: SECTION_KEYS.networkOrdering,
  label: <FormattedMessage id="ui-orders.settings.networkInteraction.label" />,
  pages: [
    {
      component: CentralOrdering,
      label: <FormattedMessage id="ui-orders.settings.centralOrdering.label" />,
      route: 'central-ordering',
      perm: 'ui-orders.settings.view',
    },
  ],
};

export const SECTIONS = [
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
      {
        component: AcquisitionMethods,
        label: <FormattedMessage id="ui-orders.settings.acquisitionMethods" />,
        route: 'acquisition-methods',
        perm: 'ui-orders.settings.view',
      },
      {
        component: CustomFieldsSettings,
        label: <FormattedMessage id="ui-orders.settings.customFields.purchaseOrders" />,
        route: 'custom-fields-po',
        perm: 'ui-orders.settings.custom-fields.view',
      },
      {
        component: CustomFieldsSettings,
        label: <FormattedMessage id="ui-orders.settings.customFields.purchaseOrderLines" />,
        route: 'custom-fields-pol',
        perm: 'ui-orders.settings.custom-fields.view',
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
        perm: 'ui-orders.settings.view',
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
  {
    label: <FormattedMessage id="ui-orders.settings.routing.label" />,
    pages: [
      {
        component: RoutingAddress,
        label: <FormattedMessage id="ui-orders.settings.routing.address" />,
        route: 'routing-address',
        perm: 'ui-orders.settings.view',
      },
      {
        component: RoutingListConfiguration,
        label: <FormattedMessage id="ui-orders.settings.routing.listConfiguration" />,
        route: 'list-configuration',
        perm: 'ui-orders.settings.view',
      },
    ],
  },
];
