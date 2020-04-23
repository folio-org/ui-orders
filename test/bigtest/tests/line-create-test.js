import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import LineEditPage from '../interactors/line-edit-page';

const PHYSICAL = 'Physical resource';
const ERESOURCE = 'Electronic resource';
const DEFAULT_CURRENCY_LABEL = 'US Dollar (USD)';

describe('Create POL', function () {
  setupApplication();

  let vendor = null;
  let order = null;
  const lineEditPage = new LineEditPage();
  const ACCOUNTS = [{
    accountNo: 'TEST_ACCOUNT',
  }];
  const SUBSCRIPTION_INTERVAL = '10';

  beforeEach(async function () {
    vendor = this.server.create('vendor', {
      discountPercent: 5,
      accounts: ACCOUNTS,
      subscriptionInterval: SUBSCRIPTION_INTERVAL,
    });
    order = this.server.create('order', {
      vendor: vendor.id,
    });

    this.visit(`/orders/view/${order.id}/po-line/create`);
    await lineEditPage.whenLoaded();
  });

  it('Template name shouldnt be displayed at edit form', () => {
    expect(lineEditPage.hasTemplateField).to.be.false;
  });

  describe('Physical Details', function () {
    beforeEach(async function () {
      await lineEditPage.selectOrderFormat(PHYSICAL);
      await lineEditPage.physicalDetailsAccordion.toggle();
    });

    it('should display details accordion', function () {
      expect(lineEditPage.physicalDetailsAccordion.isPresent).to.be.true;
    });

    it('should display Material Supplier field', function () {
      expect(lineEditPage.physicalDetailsAccordion.materialSupplierPresent).to.be.true;
    });
  });

  describe('Electronic Details', function () {
    beforeEach(async function () {
      await lineEditPage.selectOrderFormat(ERESOURCE);
      await lineEditPage.electronicDetailsAccordion.toggle();
    });

    it('should display details accordion', function () {
      expect(lineEditPage.electronicDetailsAccordion.isPresent).to.be.true;
    });

    it('should display Access Provider field', function () {
      expect(lineEditPage.electronicDetailsAccordion.accessProviderPresent).to.be.true;
    });
  });

  describe('Currency', function () {
    it('currency is default USD', function () {
      expect(lineEditPage.currency.value).to.equal(DEFAULT_CURRENCY_LABEL);
    });

    describe('change currency', function () {
      beforeEach(async function () {
        await lineEditPage.currency.button.click();
        await lineEditPage.currency.options.list(1).click();
      });

      it('currency should be changed', function () {
        expect(lineEditPage.currency.value).to.not.equal(DEFAULT_CURRENCY_LABEL);
      });
    });
  });

  describe('Default POL fields value from vendor', function () {
    describe("Non empty vendor's fields", function () {
      it('Account number', function () {
        expect(lineEditPage.accountNumber).to.equal(ACCOUNTS[0].accountNo);
      });

      it('Subscription Interval', function () {
        expect(lineEditPage.subscriptionInterval).to.equal(SUBSCRIPTION_INTERVAL);
      });
    });
  });
});
