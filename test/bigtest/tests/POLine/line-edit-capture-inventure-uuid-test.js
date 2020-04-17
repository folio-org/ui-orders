import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';

const TITLE = 'TEST_VALUE';
const QUANTITY_PHYSICAL = 2;
const INSTANCE_ID = '12345';
const CONTRIBUTOR = 'Test Contributor';
const EDITION = 'Test Edition';
const PUBLISHER = 'Test Publisher';
const PRODUCT_ID = '123456789';

describe('Line edit test - Capture UUID from inventory', function () {
  setupApplication();

  let order = null;
  let line = null;
  let location = null;
  let locations = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    location = this.server.create('location');

    locations = [
      {
        locationId: location.id,
        quantityPhysical: QUANTITY_PHYSICAL,
        quantityElectronic: 0,
      },
    ];

    line = this.server.create('line', {
      locations,
      titleOrPackage: TITLE,
      instanceId: INSTANCE_ID,
      contributors: [{
        contributor: CONTRIBUTOR,
        contributorNameTypeId: 'test',
      }],
      edition: EDITION,
      publisher: PUBLISHER,
      details: {
        productIds: [{
          productId: PRODUCT_ID,
          qualifier: 'qualifier',
        }],
      },
    });

    order = this.server.create('order', {
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/edit/${line.id}`);
    await lineEditPage.whenLoaded();
  });

  it('Item details fields are shown', () => {
    expect(lineEditPage.connectedTitleLabel).to.be.true;
  });

  describe('Remove instance ID from form', () => {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle('');
      await lineEditPage.itemDetailsAccordion.edition('');
      await lineEditPage.itemDetailsAccordion.publisher('');
    });

    it('connected link is not shown', () => {
      expect(lineEditPage.connectedTitleLabel).to.be.false;
    });
  });

  describe('Add contributor', () => {
    beforeEach(async function () {
      await lineEditPage.addContributorButton.click();
    });

    it('connected link is shown', () => {
      expect(lineEditPage.connectedTitleLabel).to.be.true;
    });
  });

  describe('Remove contributor', () => {
    beforeEach(async function () {
      await lineEditPage.removeContributorButton.click();
    });

    it('connected link is not shown', () => {
      expect(lineEditPage.connectedTitleLabel).to.be.false;
    });
  });

  describe('Remove product id', () => {
    beforeEach(async function () {
      await lineEditPage.removeProductIdsButton.click();
    });

    it('shows the connected link', () => {
      expect(lineEditPage.connectedTitleLabel).to.be.true;
    });
  });

  describe('Add product id', () => {
    beforeEach(async function () {
      await lineEditPage.addProductIdsButton.click();
    });

    it('connected link is shown', () => {
      expect(lineEditPage.connectedTitleLabel).to.be.true;
    });

    describe('Enter product id', () => {
      beforeEach(async function () {
        await lineEditPage.itemDetailsAccordion.productIds(1).fillAndBlur('new');
      });

      it('connected link is not shown', () => {
        expect(lineEditPage.connectedTitleLabel).to.be.false;
      });
    });

  });
});
