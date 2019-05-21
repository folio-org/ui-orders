import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  INVENTORY_RECORDS_TYPE,
  OTHER,
  PHYSICAL,
} from '../../../src/components/POLine/const';
import { DEFAULT_CURRENCY } from '../../../src/components/POLine/Cost/FieldCurrency';
import { ACQUISITION_METHOD } from '../../../src/components/POLine/POLineDetails/FieldAcquisitionMethod';
import {
  ORDERS_API,
} from '../../../src/components/Utils/api';
import calculateEstimatedPrice from '../../../src/components/POLine/calculateEstimatedPrice';
import setupApplication from '../helpers/setup-application';
import LineEditPage from '../interactors/line-edit-page';
import LineDetailsPage from '../interactors/line-details-page';

const TITLE = 'TEST_VALUE';
const requiredField = 'Required!';
const validationYearMessage = 'Field should be 4-digit year';
const LIST_UNIT_PRICE = 1.1;
const QUANTITY_PHYSICAL = 2;
const INSTANCE_ID = '12345';
const CONTRIBUTOR = 'Test Contributor';
const EDITION = 'Test Edition';
const cost = {
  currency: DEFAULT_CURRENCY,
  listUnitPrice: LIST_UNIT_PRICE,
  quantityPhysical: QUANTITY_PHYSICAL,
};
const LINE_ESTIMATED_PRICE = calculateEstimatedPrice({ cost });

describe('Line edit test', () => {
  setupApplication();
  let order = null;
  let line = null;
  let location = null;
  let locations = null;
  let vendor = null;
  const lineEditPage = new LineEditPage();
  const lineDetailsPage = new LineDetailsPage();

  beforeEach(function () {
    vendor = this.server.create('vendor');
    order = this.server.create('order', {
      vendor: vendor.id,
    });
    location = this.server.create('location');
    line = this.server.create('line', {
      order,
      orderFormat: PHYSICAL,
      cost,
    });

    locations = [
      {
        locationId: location.attrs.id,
        quantityPhysical: QUANTITY_PHYSICAL,
        quantityElectronic: 0,
      },
    ];

    this.server.get(`${ORDERS_API}/${order.id}`, {
      ...order.attrs,
      compositePoLines: [
        {
          ...line.attrs,
          locations,
        },
      ],
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`);
  });

  it('displays Line Edit form', () => {
    expect(lineEditPage.$root).to.exist;
    expect(lineEditPage.locationAccordion.$root).to.exist;
    expect(lineEditPage.fundDistributionAccordion.$root).to.exist;
    expect(lineEditPage.updateLineButton.isButton).to.be.true;
    expect(lineEditPage.publicationDateField.isInput).to.be.true;
    expect(lineEditPage.orderFormat.isSelect).to.be.true;
  });

  describe('Location can be added', () => {
    beforeEach(async function () {
      await lineEditPage.locationAccordion.clickHeader();
      await lineEditPage.locationAccordion.clickAddLocationButton();
    });

    it('Location is added', () => {
      expect(lineEditPage.locationAccordion.locations().length).to.be.equal(locations.length + 1);
    });
  });

  describe('Check required fields and fields with incorrect inputs', () => {
    beforeEach(async function () {
      await lineEditPage.publicationDateField.fill('111');
      await lineEditPage.updateLineButton.click();
    });

    it('displays required and error messages', () => {
      expect(lineEditPage.validationMessage).to.include(requiredField, validationYearMessage);
    });
  });

  describe('Enter valid publication date', () => {
    beforeEach(async function () {
      await lineEditPage.publicationDateField.fill('2019');
      await lineEditPage.updateLineButton.click();
    });

    it('displays only required validation message', () => {
      expect(lineEditPage.validationMessage).to.include(requiredField);
    });
  });

  it('displays Cost form', () => {
    expect(lineEditPage.listUnitPrice.isInput).to.be.true;
    expect(lineEditPage.quantityPhysical.isInput).to.be.true;
    expect(lineEditPage.additionalCost.isInput).to.be.true;
    expect(lineEditPage.listUnitPriceElectronic.isInput).to.be.true;
    expect(lineEditPage.discount.isInput).to.be.true;
    expect(lineEditPage.quantityElectronic.isInput).to.be.true;
    expect(lineEditPage.poLineEstimatedPrice.$root).to.exist;
  });

  it('displays right estimated price in Cost form', () => {
    expect(lineEditPage.poLineEstimatedPrice.value).to.include(LINE_ESTIMATED_PRICE);
  });

  describe('listUnitPrice can be changed', () => {
    const NEW_PRICE = '3.33';

    beforeEach(async function () {
      await lineEditPage.listUnitPrice.fill(NEW_PRICE);
    });

    it('listUnitPrice contains new value', () => {
      expect(lineEditPage.listUnitPrice.value).to.be.equal(NEW_PRICE);
    });
  });

  describe('discount can be changed', () => {
    const NEW_DISCOUNT = '13';

    beforeEach(async function () {
      await lineEditPage.discount.fill(NEW_DISCOUNT);
    });

    it('discount contains new value', () => {
      expect(lineEditPage.discount.value).to.be.equal(NEW_DISCOUNT);
    });
  });

  describe('Fund can be added', () => {
    beforeEach(async function () {
      await lineEditPage.fundDistributionAccordion.clickHeader();
      await lineEditPage.fundDistributionAccordion.clickAddFundButton();
    });

    it('Fund is added', () => {
      expect(lineEditPage.fundDistributionAccordion.funds().length).to.be.equal(1);
    });
  });

  describe('Volume can be added', () => {
    beforeEach(async function () {
      await lineEditPage.physicalDetailsAccordion.toggle();
      await lineEditPage.addVolumeButton.click();
    });

    it('Volume is added', () => {
      expect(lineEditPage.physicalDetailsAccordion.volumes().length).to.be.equal(1);
    });

    describe('Volume can be removed', () => {
      beforeEach(async function () {
        await lineEditPage.removeVolumeButton.click();
      });

      it('Volume is removed', () => {
        expect(lineEditPage.removeVolumeButton.isPresent).to.be.false;
      });
    });
  });

  describe('Contributor can be added', () => {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.toggle();
      await lineEditPage.addContributorButton.click();
    });

    it('contributor is added', () => {
      expect(lineEditPage.itemDetailsAccordion.contributors().length).to.be.equal(1);
    });

    describe('contributor can be removed', () => {
      beforeEach(async function () {
        await lineEditPage.removeContributorButton.click();
      });

      it('contributor is removed', () => {
        expect(lineEditPage.removeContributorButton.isPresent).to.be.false;
      });
    });
  });

  describe('Check not negative locations quantity validation', () => {
    const NEGATIVE_QUANTITY = -1;

    beforeEach(async function () {
      await lineEditPage.locationAccordion.physicalQuantity.fill(NEGATIVE_QUANTITY);
      await lineEditPage.locationAccordion.electronicQuantity.fill(NEGATIVE_QUANTITY);
      await lineEditPage.updateLineButton.click();
    });

    it('Should provide warning messages', () => {
      expect(lineEditPage.locationAccordion.warningMessage).to.be.equal('Quantity can not be less than 0');
    });
  });

  describe('Render expected PO Line form title', () => {
    describe('Create PO Line', () => {
      beforeEach(function () {
        return this.visit(`/orders/view/${order.id}/?layer=create-po-line`, () => {
          return expect(lineEditPage.$root).to.exist;
        });
      });

      it('Has to render expected title', () => {
        expect(lineEditPage.title).to.be.equal('Add PO Line');
      });
    });

    describe('Edit PO Line', () => {
      beforeEach(async function () {
        this.server.get(`${ORDERS_API}/${order.id}`, {
          ...order.attrs,
          compositePoLines: [line.attrs],
        });

        return this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`, () => {
          return expect(lineEditPage.$root).to.exist;
        });
      });

      it('Has to render expected title', () => {
        expect(lineEditPage.title).to.be.equal(`Edit - ${line.poLineNumber}`);
      });
    });
  });

  describe('Check existing warning messages for Item Details Title if value isn\'t empty', () => {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle(TITLE);
      await lineEditPage.updateLineButton.click();
    });

    it('Doesn\'t provide any warning message', () => {
      expect(lineEditPage.itemDetailsAccordion.errorTitle).to.be.equal('');
    });
  });

  describe('Check existing warning messages for Item Details Title if value is empty', () => {
    beforeEach(async function () {
      await lineEditPage.quantityPhysical.fill(20);
      await lineEditPage.itemDetailsAccordion.inputTitle('');
      await lineEditPage.updateLineButton.click();
    });

    it('Provides title warning message in case if tile is empty', () => {
      expect(lineEditPage.itemDetailsAccordion.errorTitle).to.be.equal(requiredField);
    });
  });
  describe('Other Resource Details accordion is shown', () => {
    beforeEach(async function () {
      await lineEditPage.orderFormat.select(OTHER);
      await lineEditPage.otherAccordion.clickHeader();
    });

    it('Displays create inventory field', () => {
      expect(lineEditPage.physicalCreateInventory.isSelect).to.be.true;
    });

    it('Displays order format Other', () => {
      expect(lineEditPage.orderFormat.value).to.be.equal(OTHER);
    });

    beforeEach(async function () {
      await lineEditPage.physicalCreateInventory.select(INVENTORY_RECORDS_TYPE.all);
      await lineEditPage.updateLineButton.click();
    });

    it('Displays warning message Required for Material Type', () => {
      expect(lineEditPage.otherAccordion.warningMessage).to.be.equal(requiredField);
    });

    it('Create inventory field includes Instance, Holding, Item', () => {
      expect(lineEditPage.physicalCreateInventory.value).to.be.equal(INVENTORY_RECORDS_TYPE.all);
    });
  });

  describe('Save updated PO Line', () => {
    beforeEach(async function () {
      line = this.server.create('line', {
        order,
        acquisitionMethod: ACQUISITION_METHOD.gift,
        orderFormat: PHYSICAL,
        cost,
        title: TITLE,
        locations,
      });

      this.server.get(`${ORDERS_API}/${order.id}`, {
        ...order.attrs,
        compositePoLines: [
          {
            ...line.attrs,
            locations,
          },
        ],
      });

      this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`);
      await lineEditPage.physicalCreateInventory.select(INVENTORY_RECORDS_TYPE.none);
      await lineEditPage.updateLineButton.click();
    });

    it('displays updated PO Line Details pane', () => {
      expect(lineDetailsPage.$root).to.exist;
    });
  });

  describe('Capture UUID from inventory', () => {
    beforeEach(async function () {
      line = this.server.create('line', {
        order,
        title: TITLE,
        instanceId: INSTANCE_ID,
        contributors: [{ contributor: CONTRIBUTOR }],
        edition: EDITION,
      });

      this.server.get(`${ORDERS_API}/${order.id}`, {
        ...order.attrs,
        compositePoLines: [line.attrs],
      });

      this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`);
    });

    it('Item details fields are shown', () => {
      expect(lineEditPage.instanceId).to.be.equal(INSTANCE_ID);
    });

    describe('Remove instance ID from form', () => {
      beforeEach(async function () {
        await lineEditPage.itemDetailsAccordion.inputTitle('');
        await lineEditPage.itemDetailsAccordion.edition('');
      });

      it('instance id is not shown', () => {
        expect(lineEditPage.instanceId).to.be.equal('');
      });
    });

    describe('Instance Id is shown', () => {
      beforeEach(async function () {
        await lineEditPage.addContributorButton.click();
      });

      it('instance id is shown', () => {
        expect(lineEditPage.instanceId).to.be.equal(INSTANCE_ID);
      });
    });

    describe('Instance Id is not shown', () => {
      beforeEach(async function () {
        await lineEditPage.removeContributorButton.click();
      });

      it('instance id is not shown', () => {
        expect(lineEditPage.instanceId).to.be.equal('');
      });
    });
  });
});
