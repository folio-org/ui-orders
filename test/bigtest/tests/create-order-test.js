import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderEditPage from '../interactors/order-edit-page';
import { ORDER_TYPE } from '../../../src/common/constants';
import {
  CONFIG_SUFFIXES,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';

describe('Create order', function () {
  setupApplication();
  const form = new OrderEditPage();

  beforeEach(async function () {
    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_SUFFIXES,
      enabled: true,
      value: '{"name": "SS","description":"SS1"}',
    });
    this.server.create('orderTemplate', {
      orderType: ORDER_TYPE.oneTime,
      templateCode: 'TT',
    });
    this.server.create('vendor', { isVendor: true });
    this.visit('/orders?layer=create');
    await form.whenLoaded();
  });

  describe('Template name', function () {
    it('should be displayed', () => {
      expect(form.hasTemplateField).to.be.true;
    });

    describe('Should change form', function () {
      beforeEach(async function () {
        await form.orderTemplate.template.click();
        await form.orderTemplate.options.list(1).click();
      });

      it('order type should be changed', () => {
        expect(form.orderTypeSelect.value).to.be.equal(ORDER_TYPE.oneTime);
      });
    });
  });

  it('has fields and Create button', () => {
    expect(form.hasPONumberField).to.be.true;
    expect(form.hasVendorNameField).to.be.true;
    expect(form.hasCreatedByField).to.be.true;
    expect(form.suffixSelect.value).to.be.equal('');
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
      await form.vendorSelect.button.click();
      await form.vendorSelect.options.list(0).click();
      await form.createOrderButton.click();
    });

    it('closes the Create PO form', () => {
      expect(form.isPresent).to.be.false;
    });
  });
});
