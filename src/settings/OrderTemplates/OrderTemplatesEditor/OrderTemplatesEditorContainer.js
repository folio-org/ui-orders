import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  get,
  find,
} from 'lodash';

import {
  ADDRESSES,
  ORDER_TEMPLATES,
  LOCATIONS,
  FUND,
  CREATE_INVENTORY,
  PREFIXES_SETTING,
  SUFFIXES_SETTING,
  VENDORS,
} from '../../../components/Utils/resources';
import {
  MODULE_ORDERS,
  CONFIG_ORDER_TEMPLATES,
} from '../../../components/Utils/const';
import getLocationsForSelect from '../../../components/Utils/getLocationsForSelect';
import getFundsForSelect from '../../../components/Utils/getFundsForSelect';
import {
  getCreateInventorySetting,
  getAddresses,
  getAddressOptions,
  getSettingsList,
  getVendorOptions,
} from '../../../common/utils';

import { getOrderTemplatesList } from '../util';
import OrderTemplatesEditor from './OrderTemplatesEditor';

class OrderTemplatesEditorContainer extends Component {
  static manifest = Object.freeze({
    orderTemplates: ORDER_TEMPLATES,
    locations: LOCATIONS,
    fund: FUND,
    createInventory: CREATE_INVENTORY,
    prefixesSetting: PREFIXES_SETTING,
    suffixesSetting: SUFFIXES_SETTING,
    addresses: ADDRESSES,
    vendors: VENDORS,
  });

  static propTypes = {
    close: PropTypes.func.isRequired,
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    match: PropTypes.object,
  };

  saveOrderTemplate = (values) => {
    const { close, mutator: { orderTemplates }, match, resources } = this.props;
    const orderTemplatesConfig = get(resources, ['orderTemplates', 'records'], []);
    const id = get(match, ['params', 'id']);
    const mutatorMethod = id ? 'PUT' : 'POST';
    const value = JSON.stringify(values);
    let orderTemplateBody;

    if (id) {
      orderTemplateBody = find(orderTemplatesConfig, { id });
    } else {
      orderTemplateBody = {
        module: MODULE_ORDERS,
        configName: `${MODULE_ORDERS}.${CONFIG_ORDER_TEMPLATES}`,
        code: (new Date()).valueOf(),
      };
    }

    orderTemplateBody = { ...orderTemplateBody, value };

    orderTemplates[mutatorMethod](orderTemplateBody)
      .then(close);
  };

  render() {
    const { close, resources, match } = this.props;
    const locations = getLocationsForSelect(resources);
    const funds = getFundsForSelect(resources);
    const createInventorySetting = getCreateInventorySetting(get(resources, ['createInventory', 'records'], []));
    const vendors = getVendorOptions(get(resources, 'vendors.records', []));
    const prefixesSetting = getSettingsList(get(resources, 'prefixesSetting.records', {}));
    const suffixesSetting = getSettingsList(get(resources, 'suffixesSetting.records', {}));
    const addresses = getAddressOptions(getAddresses(get(resources, 'addresses.records', [])));
    const orderTemplatesList = getOrderTemplatesList(get(resources, ['orderTemplates', 'records'], []));
    const id = get(match, ['params', 'id']);
    const template = id
      ? find(orderTemplatesList, { id })
      : {};
    const title = get(template, 'title', '');

    return (
      <OrderTemplatesEditor
        title={title}
        onSubmit={this.saveOrderTemplate}
        close={close}
        funds={funds}
        initialValues={template.orderTemplate}
        locations={locations}
        createInventorySetting={createInventorySetting}
        prefixesSetting={prefixesSetting.selectedItems}
        suffixesSetting={suffixesSetting.selectedItems}
        addresses={addresses}
        vendors={vendors}
      />
    );
  }
}

export default OrderTemplatesEditorContainer;
