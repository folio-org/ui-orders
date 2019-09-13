import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { getFormValues } from 'redux-form';

import { get } from 'lodash';

import { withStripes } from '@folio/stripes/core';

import {
  IDENTIFIER_TYPES,
  ADDRESSES,
  ORDER_TEMPLATES,
  LOCATIONS,
  FUND,
  CREATE_INVENTORY,
  PREFIXES_SETTING,
  SUFFIXES_SETTING,
  VENDORS,
  MATERIAL_TYPES,
  ORDER_TEMPLATE,
  CONTRIBUTOR_NAME_TYPES,
} from '../../../components/Utils/resources';
import {
  MODULE_ORDERS,
  CONFIG_ORDER_TEMPLATES,
} from '../../../components/Utils/const';
import getIdentifierTypesForSelect from '../../../components/Utils/getIdentifierTypesForSelect';
import getLocationsForSelect from '../../../components/Utils/getLocationsForSelect';
import getFundsForSelect from '../../../components/Utils/getFundsForSelect';
import getMaterialTypesForSelect from '../../../components/Utils/getMaterialTypesForSelect';
import getContributorNameTypesForSelect from '../../../components/Utils/getContributorNameTypesForSelect';
import {
  getCreateInventorySetting,
  getAddresses,
  getAddressOptions,
  getSettingsList,
  getVendorOptions,
} from '../../../common/utils';

import { getOrderTemplatesList } from '../util';
import OrderTemplatesEditor from './OrderTemplatesEditor';

const INITIAL_VALUES = {};

class OrderTemplatesEditorContainer extends Component {
  static manifest = Object.freeze({
    orderTemplates: {
      ...ORDER_TEMPLATES,
      fetch: false,
    },
    identifierTypes: IDENTIFIER_TYPES,
    locations: LOCATIONS,
    fund: FUND,
    createInventory: CREATE_INVENTORY,
    prefixesSetting: PREFIXES_SETTING,
    suffixesSetting: SUFFIXES_SETTING,
    addresses: ADDRESSES,
    vendors: VENDORS,
    materialTypes: MATERIAL_TYPES,
    orderTemplate: ORDER_TEMPLATE,
    contributorNameTypes: CONTRIBUTOR_NAME_TYPES,
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    stripes: PropTypes.object.isRequired,
  };

  saveOrderTemplate = (values) => {
    const { close, mutator: { orderTemplates, orderTemplate }, match, resources } = this.props;
    const id = get(match, ['params', 'id']);
    const mutator = id ? orderTemplate.PUT : orderTemplates.POST;
    let orderTemplateBody = get(resources, ['orderTemplate', 'records', 0], {});

    orderTemplateBody = { ...values };

    mutator(values).then(close);
  };

  render() {
    const { close, resources, match, stripes } = this.props;
    const formValues = getFormValues('orderTemplateForm')(stripes.store.getState()) || INITIAL_VALUES;

    const locations = getLocationsForSelect(resources);
    const funds = getFundsForSelect(resources);
    const identifierTypes = getIdentifierTypesForSelect(resources);
    const contributorNameTypes = getContributorNameTypesForSelect(resources);
    const createInventorySetting = getCreateInventorySetting(get(resources, ['createInventory', 'records'], []));
    const vendors = getVendorOptions(get(resources, 'vendors.records', []));
    const prefixesSetting = getSettingsList(get(resources, 'prefixesSetting.records', {}));
    const suffixesSetting = getSettingsList(get(resources, 'suffixesSetting.records', {}));
    const addresses = getAddressOptions(getAddresses(get(resources, 'addresses.records', [])));
    const materialTypes = getMaterialTypesForSelect(resources);
    const orderTemplate = get(resources, ['orderTemplate', 'records', 0], {});
    const id = get(match, ['params', 'id']);
    const template = id
      ? { orderTemplate }
      : { orderTemplate: INITIAL_VALUES };
    const title = get(template, ['orderTemplate', 'templateName']) || <FormattedMessage id="ui-orders.settings.orderTemplates.editor.titleCreate" />;

    return (
      <OrderTemplatesEditor
        title={title}
        onSubmit={this.saveOrderTemplate}
        close={close}
        funds={funds}
        initialValues={template.orderTemplate}
        identifierTypes={identifierTypes}
        locations={locations}
        createInventorySetting={createInventorySetting}
        prefixesSetting={prefixesSetting.selectedItems}
        suffixesSetting={suffixesSetting.selectedItems}
        addresses={addresses}
        vendors={vendors}
        materialTypes={materialTypes}
        formValues={formValues}
        contributorNameTypes={contributorNameTypes}
      />
    );
  }
}

export default withStripes(OrderTemplatesEditorContainer);
