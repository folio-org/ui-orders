import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import { Response } from 'miragejs';

import { LINES_API, ORDER_FORMATS, ORDER_STATUSES, PIECE_FORMAT } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import LineEditPage from '../../interactors/line-edit-page';
import { DeletePiecesModal } from '../../interactors';

const TITLE = 'TEST_VALUE';
const QUANTITY_PHYSICAL = 2;
const INSTANCE_ID = '12345';
const EDITION = 'Test Edition';
const PUBLISHER = 'Test Publisher';

describe.skip('Line edit test, order is Open, quantity is reduced', function () {
  setupApplication();

  let order = null;
  let line = null;
  let location = null;
  let locations = null;
  let vendor = null;
  let item = null;
  const lineEditPage = new LineEditPage();
  const deletePiecesModal = new DeletePiecesModal();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    location = this.server.create('location');
    item = this.server.create('item');

    this.server.create('request', { itemId: item.id });

    locations = [
      {
        locationId: location.id,
        quantityPhysical: QUANTITY_PHYSICAL,
        quantityElectronic: 0,
      },
    ];

    line = this.server.create('line', {
      acquisitionMethod: 'Purchase',
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        currency: 'USD',
        listUnitPrice: 1.11,
        quantityPhysical: QUANTITY_PHYSICAL,
      },
      locations,
      titleOrPackage: TITLE,
      instanceId: INSTANCE_ID,
      edition: EDITION,
      publisher: PUBLISHER,
      physical: {
        createInventory: 'None',
      },
      details: {
      },
    });

    this.server.create('piece', {
      poLineId: line.id,
      format: PIECE_FORMAT.physical,
      itemId: item.id,
    });

    order = this.server.create('order', {
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
      workflowStatus: ORDER_STATUSES.open,
    });

    this.server.put(
      `${LINES_API}/:id`,
      () => new Response(422, {}, { errors: [{ code: ERROR_CODES.piecesNeedToBeDeleted }] }),
    );

    this.visit(`/orders/view/${order.id}/po-line/edit/${line.id}`);
    await lineEditPage.whenLoaded();
    await lineEditPage.quantityPhysical.fill('1');
    await lineEditPage.locationAccordion.physicalQuantity.fill('1');
    await lineEditPage.saveButton.click();
    await deletePiecesModal.whenLoaded();
  });

  it('Delete pieces modal is present, delete btn is disabled', () => {
    expect(deletePiecesModal.isPresent).to.be.true;
    expect(deletePiecesModal.deleteBtn.isDisabled).to.be.true;
  });

  describe('Check piece and delete', function () {
    beforeEach(async function () {
      await deletePiecesModal.piecesCheckboxes(0).click();
      await deletePiecesModal.piecesCheckboxes(0).blur();
      await deletePiecesModal.deleteBtn.click();
    });

    it('Delete pieces modal is closed', () => {
      expect(deletePiecesModal.isPresent).to.be.false;
    });
  });
});
