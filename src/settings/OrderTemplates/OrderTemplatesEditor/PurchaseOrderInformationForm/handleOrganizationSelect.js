import get from 'lodash/get';
import isObject from 'lodash/isObject';

import {
  PO_FORM_FIELDS,
  POL_FORM_FIELDS,
} from '../../../../common/constants';
import { DISCOUNT_TYPE } from '../../../../components/POLine/const';

export const handleOrganizationSelect = (change, formValues) => (vendor) => {
  /* Values from vendor */
  const vendorId = vendor.id;
  const vendorPreferredCurrency = vendor.vendorCurrencies?.slice(-1)[0];
  const vendorAccount = vendor.accounts?.[0]?.accountNo;
  const claimingInterval = vendor.claimingInterval;
  const discount = vendor.discountPercent;
  const subscriptionInterval = vendor.subscriptionInterval;

  /* Values from form */
  const discountType = get(formValues, POL_FORM_FIELDS.discountType);

  /*
    * Map of fields to update: fieldName -> value | { value, condition }
  */
  const fieldsToUpdateMap = new Map([
    // === PO Fields ===
    [PO_FORM_FIELDS.vendor, vendorId],

    // === PO Line Fields ===
    /* Cost */
    [POL_FORM_FIELDS.discount, {
      value: discount,
      condition: discount != null,
    }],
    [POL_FORM_FIELDS.discountType, {
      value: DISCOUNT_TYPE.percentage,
      condition: (discount != null) && discountType !== DISCOUNT_TYPE.percentage,
    }],
    [POL_FORM_FIELDS.currency, {
      value: vendorPreferredCurrency,
      condition: vendorPreferredCurrency != null,
    }],

    /* PO Line details */
    [POL_FORM_FIELDS.claimingInterval, claimingInterval],

    /* Item details */
    [POL_FORM_FIELDS.subscriptionInterval, subscriptionInterval],

    /* Vendor */
    [POL_FORM_FIELDS.vendorDetailVendorAccount, vendorAccount],

    /* Electronic resource details */
    [POL_FORM_FIELDS.eresourceAccessProvider, vendorId],
    [POL_FORM_FIELDS.eresourceActivationDue, vendor.expectedActivationInterval],

    /* Physical resource details */
    [POL_FORM_FIELDS.physicalMaterialSupplier, vendorId],
  ]);

  fieldsToUpdateMap.forEach((config, fieldName) => {
    return isObject(config)
      ? (config.condition && change(fieldName, config.value))
      : change(fieldName, config);
  });
};
