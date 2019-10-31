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
    const { close, mutator: { orderTemplates, orderTemplate }, match } = this.props;
    const id = get(match, ['params', 'id']);
    const mutator = id ? orderTemplate.PUT : orderTemplates.POST;

    mutator(values).then(close);
  };

  render() {
    const { match, close, resources, stripes } = this.props;
    const formValues = getFormValues('orderTemplateForm')(stripes.store.getState()) || INITIAL_VALUES;

    const locations = getLocationsForSelect(resources);
    const funds = getFundsForSelect(resources);
    const identifierTypes = getIdentifierTypesForSelect(resources);
    const contributorNameTypes = getContributorNameTypesForSelect(resources);
    const createInventorySetting = getCreateInventorySetting(get(resources, ['createInventory', 'records'], []));
    const vendors = get(resources, 'vendors.records', []);
    const vendorOptions = getVendorOptions(vendors);
    const prefixesSetting = getSettingsList(get(resources, 'prefixesSetting.records', []));
    const suffixesSetting = getSettingsList(get(resources, 'suffixesSetting.records', []));
    const addresses = getAddressOptions(getAddresses(get(resources, 'addresses.records', [])));
    const materialTypes = getMaterialTypesForSelect(resources);
    const orderTemplate = get(match, ['params', 'id'])
      ? get(resources, ['orderTemplate', 'records', 0], INITIAL_VALUES)
      : INITIAL_VALUES;
    const title = get(orderTemplate, ['templateName']) || <FormattedMessage id="ui-orders.settings.orderTemplates.editor.titleCreate" />;
    const vendor = vendors.find(v => v.id === get(formValues, 'vendor'));
    const accounts = get(vendor, 'accounts', []).map(({ accountNo }) => ({
      label: accountNo,
      value: accountNo,
    }));

    return (
      <OrderTemplatesEditor
        title={title}
        onSubmit={this.saveOrderTemplate}
        close={close}
        funds={funds}
        initialValues={orderTemplate}
        identifierTypes={identifierTypes}
        locations={locations}
        createInventorySetting={createInventorySetting}
        prefixesSetting={prefixesSetting}
        suffixesSetting={suffixesSetting}
        addresses={addresses}
        vendors={vendorOptions}
        materialTypes={materialTypes}
        formValues={formValues}
        contributorNameTypes={contributorNameTypes}
        accounts={accounts}
      />
    );
  }
}

export default withStripes(OrderTemplatesEditorContainer);
