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
      title: TITLE,
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

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`);
    await lineEditPage.whenLoaded();
  });

  it('Item details fields are shown', () => {
    expect(lineEditPage.instanceId).to.be.equal(INSTANCE_ID);
  });

  describe('Remove instance ID from form', () => {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle('');
      await lineEditPage.itemDetailsAccordion.edition('');
      await lineEditPage.itemDetailsAccordion.publisher('');
    });

    it('instance id is not shown', () => {
      expect(lineEditPage.instanceId).to.be.equal('');
    });
  });

  describe('Add contributor', () => {
    beforeEach(async function () {
      await lineEditPage.addContributorButton.click();
    });

    it('instance id is shown', () => {
      expect(lineEditPage.instanceId).to.be.equal(INSTANCE_ID);
    });
  });

  describe('Remove contributor and product id', () => {
    beforeEach(async function () {
      await lineEditPage.removeContributorButton.click();
      await lineEditPage.removeProductIdsButton.click();
    });

    it('instance id is not shown', () => {
      expect(lineEditPage.instanceId).to.be.equal('');
    });
  });
});
