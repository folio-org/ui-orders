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
const TEST_CURRENCY = 'Canadian Dollar (CAD)';
const TEST_CURRENCY_CODE = 'CAD';

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

    this.visit(`/orders/view/${order.id}?layer=create-po-line`);
    await lineEditPage.whenLoaded();
  });

  describe('Template name', function () {
    it('should be displayed', () => {
      expect(lineEditPage.hasTemplateField).to.be.true;
    });
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
    it('currency is not empty ', function () {
      expect(lineEditPage.currency.value).to.not.equal('');
    });

    describe('change currency', function () {
      beforeEach(async function () {
        await lineEditPage.currency.select(TEST_CURRENCY);
      });

      it('currency should be changed', function () {
        expect(lineEditPage.currency.value).to.equal(TEST_CURRENCY_CODE);
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
