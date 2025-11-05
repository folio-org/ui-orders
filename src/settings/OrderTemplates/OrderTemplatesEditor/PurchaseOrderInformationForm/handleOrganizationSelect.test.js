import {
  PO_FORM_FIELDS,
  POL_FORM_FIELDS,
} from '../../../../common/constants';
import { DISCOUNT_TYPE } from '../../../../components/POLine/const';
import { handleOrganizationSelect } from './handleOrganizationSelect';

describe('handleOrganizationSelect', () => {
  it('should apply all updates when vendor provides values and discountType needs change', () => {
    const change = jest.fn();
    const vendor = {
      id: 'vendor-1',
      vendorCurrencies: [{ code: 'EUR' }, { code: 'USD' }],
      accounts: [{ accountNo: 'ACC-123' }],
      claimingInterval: 'weekly',
      discountPercent: 10,
      subscriptionInterval: 'monthly',
      expectedActivationInterval: 7,
    };
    const formValues = {
      // current discountType different from percentage so discountType should be set to percentage
      [POL_FORM_FIELDS.discountType]: 'amount',
    };

    handleOrganizationSelect(change, formValues)(vendor);

    // Expect 10 updates as every map entry should trigger when values are present
    expect(change).toHaveBeenCalledTimes(10);

    expect(change).toHaveBeenCalledWith(PO_FORM_FIELDS.vendor, vendor.id);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.discount, vendor.discountPercent);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.discountType, DISCOUNT_TYPE.percentage);

    // vendorPreferredCurrency is the last element of vendor.vendorCurrencies
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.currency, vendor.vendorCurrencies.slice(-1)[0]);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.claimingInterval, vendor.claimingInterval);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.subscriptionInterval, vendor.subscriptionInterval);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.vendorDetailVendorAccount, vendor.accounts[0].accountNo);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.eresourceAccessProvider, vendor.id);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.eresourceActivationDue, vendor.expectedActivationInterval);
    expect(change).toHaveBeenCalledWith(POL_FORM_FIELDS.physicalMaterialSupplier, vendor.id);
  });

  it('should skip conditional updates when vendor lacks values or condition false', () => {
    const change = jest.fn();
    const vendor = {
      id: 'vendor-2',
      // no vendorCurrencies, no accounts, no discountPercent, no claiming/subscription intervals, etc.
    };
    const formValues = {
      // discountType already percentage, so discountType update condition should be false even if discount existed
      [POL_FORM_FIELDS.discountType]: DISCOUNT_TYPE.percentage,
    };

    handleOrganizationSelect(change, formValues)(vendor);

    // There are 10 entries in the map; 3 of them are conditional objects (discount, discountType, currency)
    // Those should be skipped here. The remaining 7 direct-config entries will still invoke change (possibly with undefined).
    expect(change).toHaveBeenCalledTimes(7);

    // PO vendor should always be set
    expect(change).toHaveBeenCalledWith(PO_FORM_FIELDS.vendor, vendor.id);

    // Conditional fields should NOT be set
    const calledFieldNames = change.mock.calls.map(call => call[0]);

    expect(calledFieldNames).not.toContain(POL_FORM_FIELDS.discount);
    expect(calledFieldNames).not.toContain(POL_FORM_FIELDS.discountType);
    expect(calledFieldNames).not.toContain(POL_FORM_FIELDS.currency);

    // Fields that use vendor id directly should still be invoked (even if value other args are undefined)
    expect(calledFieldNames).toContain(POL_FORM_FIELDS.eresourceAccessProvider);
    expect(calledFieldNames).toContain(POL_FORM_FIELDS.physicalMaterialSupplier);
  });
});
