import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  get,
  find,
} from 'lodash';

import {
  ORDER_TEMPLATES,
  LOCATIONS,
  FUND,
  CREATE_INVENTORY,
} from '../../../components/Utils/resources';
import {
  MODULE_ORDERS,
  CONFIG_ORDER_TEMPLATES,
} from '../../../components/Utils/const';
import getLocationsForSelect from '../../../components/Utils/getLocationsForSelect';
import getFundsForSelect from '../../../components/Utils/getFundsForSelect';
import { getCreateInventorySetting } from '../../../common/utils';

import { getOrderTemplatesList } from '../util';
import OrderTemplatesEditor from './OrderTemplatesEditor';

class OrderTemplatesEditorContainer extends Component {
  static manifest = Object.freeze({
    orderTemplates: ORDER_TEMPLATES,
    locations: LOCATIONS,
    fund: FUND,
    createInventory: CREATE_INVENTORY,
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
    const orderTemplatesList = getOrderTemplatesList(get(resources, ['orderTemplates', 'records'], []));
    const id = get(match, ['params', 'id']);
    const template = id
      ? find(orderTemplatesList, { id })
      : {};
    const title = get(template, 'title', '');

    return (
      <OrderTemplatesEditor
        close={close}
        funds={funds}
        initialValues={template.orderTemplate}
        locations={locations}
        createInventorySetting={createInventorySetting}
        onSubmit={this.saveOrderTemplate}
        title={title}
      />
    );
  }
}

export default OrderTemplatesEditorContainer;
