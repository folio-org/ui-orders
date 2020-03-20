import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';

describe('Create PO Line simple test', function () {
  setupApplication();

  let order = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    order = this.server.create('order', {
      vendor: vendor.id,
    });

    this.visit(`/orders/view/${order.id}/po-line/create`);
    await lineEditPage.whenLoaded();
  });

  it('Has to render expected title', function () {
    expect(lineEditPage.title).to.be.equal('Add PO line');
  });
});
