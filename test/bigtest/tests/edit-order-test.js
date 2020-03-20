import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderEditPage from '../interactors/order-edit-page';
import { ORDER_TYPE } from '../../../src/common/constants';

describe('OrderEditPage', function () {
  setupApplication();

  let order = null;
  const orderEditPage = new OrderEditPage();

  beforeEach(async function () {
    order = this.server.create('order');

    this.visit(`/orders/edit/${order.id}`);
    await orderEditPage.whenLoaded();
  });

  it('displays Edit Order form', function () {
    expect(orderEditPage.$root).to.exist;
    expect(orderEditPage.isOngoingInfoOpen).to.be.false;
    expect(orderEditPage.addNoteButton.isButton).to.be.true;
    expect(orderEditPage.notes().length).to.be.equal(1);
  });

  it('should have Template name field', () => {
    expect(orderEditPage.hasTemplateField).to.be.true;
  });

  describe('Select order type Ongoing', function () {
    beforeEach(async function () {
      await orderEditPage.orderTypeSelect.select(ORDER_TYPE.ongoing);
      await orderEditPage.renewalsAccordion.clickIsSubscriptionCheckbox();
    });

    it('displays Ongoing Order Info Accordion', function () {
      expect(orderEditPage.isOngoingInfoOpen).to.be.true;
      expect(orderEditPage.renewalsAccordion.renewalInterval).to.be.true;
    });
  });

  describe('Click on remove note button', function () {
    beforeEach(async function () {
      await orderEditPage.removeNoteButton.click();
    });

    it('remove note', function () {
      expect(orderEditPage.removeNoteButton.isPresent).to.be.false;
    });
  });

  describe('Click on add note button', function () {
    beforeEach(async function () {
      await orderEditPage.addNoteButton.click();
    });

    it('add note textarea', function () {
      expect(orderEditPage.notes().length).to.be.equal(2);
    });
  });
});
