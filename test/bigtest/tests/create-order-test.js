import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderDetailsPage from '../interactors/order-details-page';
import OrderEditPage from '../interactors/order-edit-page';
import { ORDER_TYPE } from '../../../src/common/constants';

describe('Create order', function () {
  setupApplication();
  const form = new OrderEditPage();
  const orderDetailsPage = new OrderDetailsPage();

  beforeEach(async function () {
    this.server.create('suffix', {
      name: 'SS',
    });
    this.server.create('orderTemplate', {
      orderType: ORDER_TYPE.oneTime,
      templateCode: 'TT',
    });
    this.server.create('vendor', { isVendor: true });
    this.visit('/orders/create');
    await form.whenLoaded();
  });

  it('Template name should be displayed', () => {
    expect(form.hasTemplateField).to.be.true;
  });

  describe('Select template', function () {
    beforeEach(async function () {
      await form.orderTemplate.template.click();
      await form.orderTemplate.options.list(1).click();
    });

    it('order type should be changed', () => {
      expect(form.orderTypeSelect.value).to.be.equal(ORDER_TYPE.oneTime);
    });
  });

  it('has fields and Create button', () => {
    expect(form.hasPONumberField).to.be.true;
    expect(form.hasVendorNameField).to.be.true;
    expect(form.hasCreatedByField).to.be.true;
    expect(form.createOrderButton.isPresent).to.be.true;
  });

  describe('suffix could be selected', () => {
    beforeEach(async () => {
      await form.suffixSelect.select('SS');
    });

    it('suffix is changed to "SS"', () => {
      expect(form.suffixSelect.value).to.be.equal('SS');
    });
  });

  describe('suffix could be changed back to empty value', () => {
    beforeEach(async () => {
      await form.suffixSelect.select('SS');
      await form.suffixSelect.select('');
    });

    it('suffix is changed back to blank', () => {
      expect(form.suffixSelect.value).to.be.equal('');
    });
  });

  describe('Create new order', () => {
    beforeEach(async () => {
      await form.orderTypeSelect.select('One-time');
      await form.fillVendor('ui-23-ve');
      await form.createOrderButton.click();
      await orderDetailsPage.whenLoaded();
    });

    it('closes the Create PO form', () => {
      expect(form.isPresent).to.be.false;
    });
  });
});
