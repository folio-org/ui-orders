import get from 'lodash/get';
import set from 'lodash/set';

import { sourceValues } from '@folio/stripes-acq-components';

import {
  DISCOUNT_TYPE,
  POL_TEMPLATE_FIELDS_LIST,
  POL_TEMPLATE_FIELDS_MAP,
} from './const';
import { createPOLDataFromInstance } from './Item/util';

const DEFAULT_INITIAL_VALUES = {};

export const buildInitialPOLineFormValues = ({
  createInventorySetting,
  customFields,
  enabled,
  identifierTypeOptions,
  instance,
  isCreateFromInstance,
  order,
  stripes,
  template,
  vendor,
}) => {
  if (!enabled) return DEFAULT_INITIAL_VALUES;

  const essentialInitialValues = {
    purchaseOrderId: order?.id,
    source: sourceValues.user,
  };

  const inventoryDataToMerge = isCreateFromInstance
    ? {
      ...createPOLDataFromInstance(instance, identifierTypeOptions),
      isPackage: false,
    }
    : {};

  return template?.id
    ? buildInitialValuesBasedOnTemplate({
      customFields,
      essentialInitialValues,
      inventoryDataToMerge,
      template,
    })
    : buildInitialValuesWithoutTemplate({
      createInventorySetting,
      essentialInitialValues,
      instance,
      inventoryDataToMerge,
      stripes,
      vendor,
    });
};

function buildInitialValuesWithoutTemplate({
  createInventorySetting,
  essentialInitialValues,
  instance,
  inventoryDataToMerge,
  stripes,
  vendor,
}) {
  // Get the vendor's latest currency as default
  const vendorPreferredCurrency = vendor?.vendorCurrencies?.slice(-1)[0];

  const newObj = {
    ...essentialInitialValues,
    claimingActive: false,
    claimingInterval: vendor?.claimingInterval,
    cost: {
      currency: vendorPreferredCurrency || stripes.currency,
      discountType: DISCOUNT_TYPE.percentage,
    },
    vendorDetail: {
      instructions: '',
      vendorAccount: get(vendor, 'accounts[0].accountNo', ''),
    },
    details: {
      subscriptionInterval: get(vendor, 'subscriptionInterval'),
    },
    eresource: {
      createInventory: createInventorySetting?.eresource,
    },
    physical: {
      createInventory: createInventorySetting?.physical,
    },
    locations: [],
    isPackage: false,
    checkinItems: false,
    suppressInstanceFromDiscovery: instance?.discoverySuppress || false,
  };

  if (vendor?.id) {
    newObj.eresource.accessProvider = vendor.id;
    newObj.physical.materialSupplier = vendor.id;

    if (vendor?.discountPercent) {
      newObj.cost.discountType = DISCOUNT_TYPE.percentage;
      newObj.cost.discount = vendor.discountPercent;
    }
  }

  return {
    ...newObj,
    ...inventoryDataToMerge,
  };
}

function buildInitialValuesBasedOnTemplate({
  customFields,
  essentialInitialValues,
  inventoryDataToMerge,
  template,
}) {
  const fieldsToPopulate = Array.from(
    new Set([
      ...POL_TEMPLATE_FIELDS_LIST,
      ...(customFields || []).map(({ refId }) => `customFields.${refId}`),
    ]),
  );

  const initialValues = fieldsToPopulate.reduce((acc, field) => {
    const formFieldField = POL_TEMPLATE_FIELDS_MAP[field] || field;
    const templateFieldValue = get(template, field);

    if (templateFieldValue !== undefined) {
      set(acc, formFieldField, templateFieldValue);
    }

    return acc;
  }, { ...essentialInitialValues });

  return {
    ...initialValues,
    ...inventoryDataToMerge,
  };
}
