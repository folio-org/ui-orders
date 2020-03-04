import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ACCORDION_ID as PO_LINE_ACCORDION } from '../../components/POLine/const';

export const ORDER_TEMPLATES_ACCORDION = {
  TEMPLATE_INFO: 'templateInfo',
  PO_INFO: 'poInfo',
  PO_ONGOING: 'ongoing',
  PO_NOTES: 'poNotes',
  PO_TAGS: 'poTags',
  PO_SUMMARY: 'poSummary',
  POL_ITEM_DETAILS: PO_LINE_ACCORDION.itemDetails,
  POL_DETAILS: PO_LINE_ACCORDION.lineDetails,
  POL_COST_DETAILS: PO_LINE_ACCORDION.costDetails,
  POL_VENDOR: PO_LINE_ACCORDION.vendor,
  POL_FUND_DISTIBUTION: PO_LINE_ACCORDION.fundDistribution,
  POL_ERESOURCES: PO_LINE_ACCORDION.eresources,
  POL_FRESOURCES: PO_LINE_ACCORDION.physical,
  POL_OTHER_RESOURCES: PO_LINE_ACCORDION.other,
  POL_LOCATION: PO_LINE_ACCORDION.location,
  POL_TAGS: 'polTags',
};

export const ORDER_TEMPLATES_ACCORDION_TITLES = {
  [ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.template" />,
  [ORDER_TEMPLATES_ACCORDION.PO_INFO]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poInfo" />,
  [ORDER_TEMPLATES_ACCORDION.PO_ONGOING]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poOngoing" />,
  [ORDER_TEMPLATES_ACCORDION.PO_NOTES]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poNotes" />,
  [ORDER_TEMPLATES_ACCORDION.PO_TAGS]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poTags" />,
  [ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poSummary" />,
  [ORDER_TEMPLATES_ACCORDION.PO_ONGOING]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poOngoing" />,
  [ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.poItemDetails" />,
  [ORDER_TEMPLATES_ACCORDION.POL_DETAILS]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polDetails" />,
  [ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polCostDetails" />,
  [ORDER_TEMPLATES_ACCORDION.POL_VENDOR]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polVendor" />,
  [ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polFundDistribution" />,
  [ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polEResources" />,
  [ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polFResources" />,
  [ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polOtherResources" />,
  [ORDER_TEMPLATES_ACCORDION.POL_LOCATION]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polLocation" />,
  [ORDER_TEMPLATES_ACCORDION.POL_TAGS]: <FormattedMessage id="ui-orders.settings.orderTemplates.accordion.polTags" />,
};
