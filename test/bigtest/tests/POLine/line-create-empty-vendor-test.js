import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';

describe("Create POL - Empty vendor's fields", function () {
  setupApplication();

  let vendor = null;
  let order = null;
  const lineEditPage = new LineEditPage();

  beforeEach(async function () {
    vendor = this.server.create('vendor', {
      discountPercent: 5,
      isVendor: true,
    });
    order = this.server.create('order', {
      poLines: [],
      vendor: vendor.id,
    });

    this.visit(`/orders/view/${order.id}/po-line/create`);
    await lineEditPage.whenLoaded();
  });

  it('Account number', function () {
    expect(lineEditPage.accountNumber).to.equal('');
  });

  it('Currency', function () {
    expect(lineEditPage.currency).to.not.equal('');
  });

  it('Subscription Interval', function () {
    expect(lineEditPage.subscriptionInterval).to.equal('');
  });
});
