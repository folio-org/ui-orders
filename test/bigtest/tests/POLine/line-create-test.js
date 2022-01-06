import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import { TIMEOUT } from '../../interactors/const';
import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';

describe('Create PO Line simple test', function () {
  setupApplication();

  let order = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    order = this.server.create('order', {
      vendor: vendor.id,
    });
    this.server.createList('acquisitionMethod', 5);

    this.visit(`/orders/view/${order.id}/po-line/create`);
    await lineEditPage.whenLoaded();
  });

  it('Has to render expected title', function () {
    expect(lineEditPage.title).to.be.equal('Add PO line');
    expect(lineEditPage.saveButton.isDisabled).to.be.true;
  });

  describe('Add title', () => {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle('test');
    });

    it('enables save button', function () {
      expect(lineEditPage.saveButton.isDisabled).to.be.false;
    });
  });
});
