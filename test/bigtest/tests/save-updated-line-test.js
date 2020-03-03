import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  INVENTORY_RECORDS_TYPE,
  PHYSICAL,
} from '../../../src/components/POLine/const';
import { ACQUISITION_METHOD } from '../../../src/common/POLFields';
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
      orderFormat: PHYSICAL,
      cost,
      titleOrPackage: TITLE,
      locations,
    });
    order = this.server.create('order', {
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`);
    await lineEditPage.whenLoaded();
    await lineEditPage.physicalDetailsAccordion.toggle();
    await lineEditPage.physicalCreateInventory.select(INVENTORY_RECORDS_TYPE.none);
    await lineEditPage.updateLineButton.click();
    await lineDetailsPage.whenLoaded();
  });

  it('displays updated PO Line Details pane', () => {
    expect(lineDetailsPage.$root).to.exist;
  });
});
