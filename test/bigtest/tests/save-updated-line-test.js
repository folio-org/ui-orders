import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ACQUISITION_METHOD,
  INVENTORY_RECORDS_TYPE,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import { TIMEOUT } from '../interactors/const';
import setupApplication from '../helpers/setup-application';
import LineEditPage from '../interactors/line-edit-page';
import LineDetailsPage from '../interactors/line-details-page';

const TITLE = 'TEST_VALUE';
const LIST_UNIT_PRICE = 1.1;
const QUANTITY_PHYSICAL = 2;
const cost = {
  currency: 'USD',
  listUnitPrice: LIST_UNIT_PRICE,
  quantityPhysical: QUANTITY_PHYSICAL,
};

describe('Edit PO Line - Save updated PO Line', function () {
  setupApplication();

  let order = null;
  let line = null;
  let location = null;
  let locations = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();
  const lineDetailsPage = new LineDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    vendor = this.server.create('vendor');

    location = this.server.create('location');
    locations = [
      {
        locationId: location.attrs.id,
        quantityPhysical: QUANTITY_PHYSICAL,
        quantityElectronic: 0,
      },
    ];
    line = this.server.create('line', {
      acquisitionMethod: ACQUISITION_METHOD.gift,
      orderFormat: ORDER_FORMATS.physicalResource,
      cost,
      titleOrPackage: TITLE,
      locations,
    });
    order = this.server.create('order', {
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/edit/${line.id}`);
    await lineEditPage.whenLoaded();
    await lineEditPage.physicalCreateInventory.focus();
    await lineEditPage.physicalCreateInventory.select(INVENTORY_RECORDS_TYPE.none);
    await lineEditPage.physicalCreateInventory.blur();
    await lineEditPage.updateLineButton.blur();
    await lineEditPage.updateLineButton.focus();
    await lineEditPage.updateLineButton.click();
    await lineDetailsPage.whenLoaded();
  });

  it('displays updated PO Line Details pane', () => {
    expect(lineDetailsPage.$root).to.exist;
  });
});
