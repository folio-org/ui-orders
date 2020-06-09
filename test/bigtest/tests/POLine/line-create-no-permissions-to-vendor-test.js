import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import { VENDORS_API } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';
import {
  CalloutInteractor,
  OrderDetailsPage,
} from '../../interactors';

describe('Create PO Line with no permissions to vendor', function () {
  setupApplication();

  let order = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();
  const poDetails = new OrderDetailsPage();
  const calloutInteractor = new CalloutInteractor();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    order = this.server.create('order', {
      vendor: vendor.id,
    });
    this.server.get(
      `${VENDORS_API}/${vendor.id}`,
      () => new Response(403, {}, { errors: [{ message: 'User does not have permissions - operation is restricted' }] }),
    );

    this.visit(`/orders/view/${order.id}/po-line/create`);
  });

  it('PO line form is not opened', function () {
    expect(lineEditPage.isPresent).to.be.false;
    expect(calloutInteractor.anyCalloutIsPresent).to.be.true;
    expect(calloutInteractor.list().length).to.equal(2);
    expect(calloutInteractor.list(0).message).to.equal('Error on fetching PO Vendor');
  });

  describe('Click cancel to close the spinner', () => {
    beforeEach(async function () {
      await lineEditPage.closeBtn.click();
      await poDetails.whenLoaded();
    });

    it('goes to PO details', function () {
      expect(poDetails.isPresent).to.be.true;
    });
  });
});
