import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import SettingOrderApprovalsInteractor from '../../interactors/settings/setting-edit-order-approvals';

describe('Setting of Order Approvals', function () {
  setupApplication();

  const setting = new SettingOrderApprovalsInteractor();

  beforeEach(function () {
    this.visit('/settings/orders/approvals');
  });

  it('renders', () => {
    expect(setting.isPresent).to.be.true;
  });
});
