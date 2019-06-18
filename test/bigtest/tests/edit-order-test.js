import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import OrderEditPage from '../interactors/order-edit-page';
import { ORDER_TYPE } from '../../../src/components/PurchaseOrder/PODetails/FieldOrderType';

const OWNER_TEST_VALUE = 'some team';

describe('OrderEditPage', function () {
  setupApplication();

  let order = null;
  const orderEditPage = new OrderEditPage();

  beforeEach(async function () {
    order = this.server.create('order', { owner: OWNER_TEST_VALUE });

    this.visit(`/orders/view/${order.id}?layer=edit`);
    await orderEditPage.whenLoaded();
  });

  it('displays Edit Order form', function () {
    expect(orderEditPage.$root).to.exist;
    expect(orderEditPage.renewalsAccordion).to.be.false;
    expect(orderEditPage.addNoteButton.isButton).to.be.true;
    expect(orderEditPage.notes().length).to.be.equal(1);
  });

  describe('Select order type Ongoing', function () {
    beforeEach(async function () {
      await orderEditPage.orderTypeSelect.select(ORDER_TYPE.ongoing);
    });

    it('displays Renewals Accordion', function () {
      expect(orderEditPage.renewalsAccordion).to.be.true;
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
