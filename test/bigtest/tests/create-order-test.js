import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrdersInteractor from '../interactors/orders';
import OrderEditPage from '../interactors/order-edit-page';
// import { ORDER_TYPE } from '../../../src/components/PurchaseOrder/PODetails/FieldOrderType';
import {
  CONFIG_SUFFIXES,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';

describe('Create order', function () {
  setupApplication();

  const orders = new OrdersInteractor();
  const form = new OrderEditPage();

  beforeEach(async function () {
    this.server.create('configs', {
      module: MODULE_ORDERS,
      configName: CONFIG_SUFFIXES,
      enabled: true,
      value: '{"selectedItems":["SS"],"suffixes":["SS1","SS2","SS"]}',
    });
    this.visit('/orders?layer=create');
    await form.whenLoaded();
  });

  it('has a Template name field', () => {
    expect(orders.hasTemplateField).to.be.true;
  });

  it('has fields and Create button', () => {
    expect(orders.hasPONumberField).to.be.true;
    expect(orders.hasVendorNameField).to.be.true;
    expect(orders.hasCreatedByField).to.be.true;
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

  // TODO: to fix test with selecting required vendor field
  // describe('Create new order', () => {
  //   beforeEach(async () => {
  //     await form.orderTypeSelect.select(ORDER_TYPE.oneTime);
  //     await form.vendorSelect.select('EBSCO');
  //     await form.createOrderButton.click();
  //   });
  //
  //   it('displays list of orders, new order is created ', () => {
  //     expect(orders.$root).to.exist;
  //     expect(form.isPresent).to.be.false;
  //     expect(orders.orders().length).to.be.equal(1);
  //   });
  // });
});
