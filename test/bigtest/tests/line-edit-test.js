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
import calculateEstimatedPrice from '../../../src/components/POLine/calculateEstimatedPrice';
import setupApplication from '../helpers/setup-application';
import LineEditPage from '../interactors/line-edit-page';

const TITLE = 'TEST_VALUE';
const requiredField = 'Required!';
const validationYearMessage = 'Field should be 4-digit year';
const LIST_UNIT_PRICE = 1.1;
const QUANTITY_PHYSICAL = 2;
const cost = {
  currency: DEFAULT_CURRENCY,
  listUnitPrice: LIST_UNIT_PRICE,
  quantityPhysical: QUANTITY_PHYSICAL,
};
const LINE_ESTIMATED_PRICE = calculateEstimatedPrice({ cost });

describe.only('Line edit test', function () {
  setupApplication();

  let order = null;
  let line = null;
  let location = null;
  let locations = null;
  let vendor = null;
  let contributorNameType = null;
  let identifierType = null;
  const lineEditPage = new LineEditPage();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    location = this.server.create('location');
    contributorNameType = this.server.create('contributor-name-type');
    identifierType = this.server.create('identifier-type');

    locations = [
      {
        locationId: location.attrs.id,
        quantityPhysical: QUANTITY_PHYSICAL,
        quantityElectronic: 0,
      },
    ];

    line = this.server.create('line', {
      orderFormat: PHYSICAL,
      cost,
      locations,
    });

    order = this.server.create('order', {
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}?layer=edit-po-line`);
    await lineEditPage.whenLoaded();
  });

  it('displays Line Edit form', function () {
    expect(lineEditPage.$root).to.exist;
    expect(lineEditPage.locationAccordion.$root).to.exist;
    expect(lineEditPage.fundDistributionAccordion.$root).to.exist;
    expect(lineEditPage.updateLineButton.isButton).to.be.true;
    expect(lineEditPage.publicationDateField.isInput).to.be.true;
    expect(lineEditPage.orderFormat.isSelect).to.be.true;
  });

  describe('Template name', function () {
    it('should not be displayed', () => {
      expect(lineEditPage.hasTemplateField).to.be.false;
    });
  });

  describe('Location can be added', function () {
    beforeEach(async function () {
      await lineEditPage.locationAccordion.clickHeader();
      await lineEditPage.locationAccordion.clickAddLocationButton();
    });

    it('Location is added', function () {
      expect(lineEditPage.locationAccordion.locations().length).to.be.equal(locations.length + 1);
    });
  });

  describe('Check required fields and fields with incorrect inputs', function () {
    beforeEach(async function () {
      await lineEditPage.publicationDateField.fill('111');
      await lineEditPage.updateLineButton.click();
    });

    it('displays required and error messages', function () {
      expect(lineEditPage.validationMessage).to.include(requiredField, validationYearMessage);
    });
  });

  describe('Enter valid publication date', function () {
    beforeEach(async function () {
      await lineEditPage.publicationDateField.fill('2019');
      await lineEditPage.updateLineButton.click();
    });

    it('displays only required validation message', function () {
      expect(lineEditPage.validationMessage).to.include(requiredField);
    });
  });

  it('displays Cost form', function () {
    expect(lineEditPage.listUnitPrice.isInput).to.be.true;
    expect(lineEditPage.quantityPhysical.isInput).to.be.true;
    expect(lineEditPage.additionalCost.isInput).to.be.true;
    expect(lineEditPage.listUnitPriceElectronic.isInput).to.be.true;
    expect(lineEditPage.discount.isInput).to.be.true;
    expect(lineEditPage.quantityElectronic.isInput).to.be.true;
    expect(lineEditPage.poLineEstimatedPrice.$root).to.exist;
  });

  it('displays right estimated price in Cost form', function () {
    expect(lineEditPage.poLineEstimatedPrice.value).to.include(LINE_ESTIMATED_PRICE);
  });

  describe('listUnitPrice can be changed', function () {
    const NEW_PRICE = '3.33';

    beforeEach(async function () {
      await lineEditPage.listUnitPrice.fill(NEW_PRICE);
    });

    it('listUnitPrice contains new value', function () {
      expect(lineEditPage.listUnitPrice.value).to.be.equal(NEW_PRICE);
    });
  });

  describe('discount can be changed', function () {
    const NEW_DISCOUNT = '13';

    beforeEach(async function () {
      await lineEditPage.discount.fill(NEW_DISCOUNT);
    });

    it('discount contains new value', function () {
      expect(lineEditPage.discount.value).to.be.equal(NEW_DISCOUNT);
    });
  });

  describe('Fund can be added', function () {
    beforeEach(async function () {
      await lineEditPage.fundDistributionAccordion.clickHeader();
      await lineEditPage.fundDistributionAccordion.clickAddFundButton();
    });

    it('Fund is added', function () {
      expect(lineEditPage.fundDistributionAccordion.funds().length).to.be.equal(1);
    });
  });

  describe('Volume can be added', function () {
    beforeEach(async function () {
      await lineEditPage.physicalDetailsAccordion.toggle();
      await lineEditPage.addVolumeButton.click();
    });

    it('Volume is added', function () {
      expect(lineEditPage.physicalDetailsAccordion.volumes().length).to.be.equal(1);
    });

    describe('Volume can be removed', function () {
      beforeEach(async function () {
        await lineEditPage.removeVolumeButton.click();
      });

      it('Volume is removed', function () {
        expect(lineEditPage.removeVolumeButton.isPresent).to.be.false;
      });
    });
  });

  describe('Contributor can be added', function () {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.toggle();
      await lineEditPage.addContributorButton.click();
    });

    it('contributor is added', function () {
      expect(lineEditPage.itemDetailsAccordion.contributorNames().length).to.be.equal(1);
      expect(lineEditPage.itemDetailsAccordion.contributorTypes().length).to.be.equal(1);
    });

    it('contributor type is select', function () {
      expect(lineEditPage.itemDetailsAccordion.contributorType.isSelect).to.be.true;
    });

    it('contributor name is input', function () {
      expect(lineEditPage.itemDetailsAccordion.contributorName.isInput).to.be.true;
    });

    describe('contributor can be updated', function () {
      const testName = 'test name';

      beforeEach(async function () {
        await lineEditPage.itemDetailsAccordion.contributorType.select(contributorNameType.name);
        await lineEditPage.itemDetailsAccordion.contributorName.fill(testName);
      });

      it('contributor name is updated', function () {
        expect(lineEditPage.itemDetailsAccordion.contributorName.value).to.be.equal(testName);
      });

      it('contributor type is updated', function () {
        expect(lineEditPage.itemDetailsAccordion.contributorType.value).to.be.equal(contributorNameType.id);
      });
    });

    describe('contributor can be removed', function () {
      beforeEach(async function () {
        await lineEditPage.removeContributorButton.click();
      });

      it('contributor is removed', function () {
        expect(lineEditPage.removeContributorButton.isPresent).to.be.false;
      });
    });
  });

  describe('Product Ids can be added', function () {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.toggle();
      await lineEditPage.addProductIdsButton.click();
    });

    it('product Ids fields are added', function () {
      expect(lineEditPage.itemDetailsAccordion.productIds().length).to.be.equal(1);
      expect(lineEditPage.itemDetailsAccordion.productIdTypes().length).to.be.equal(1);
    });

    it('product Ids type is select', function () {
      expect(lineEditPage.itemDetailsAccordion.productIdType.isSelect).to.be.true;
    });

    it('product Id is input', function () {
      expect(lineEditPage.itemDetailsAccordion.productId.isInput).to.be.true;
    });

    describe('product Ids can be updated', function () {
      const testName = 'test name';

      beforeEach(async function () {
        await lineEditPage.itemDetailsAccordion.productIdType.select(identifierType.name);
        await lineEditPage.itemDetailsAccordion.productId.fill(testName);
      });

      it('product Id is updated', function () {
        expect(lineEditPage.itemDetailsAccordion.productId.value).to.be.equal(testName);
      });

      it('product Ids type is updated', function () {
        expect(lineEditPage.itemDetailsAccordion.productIdType.value).to.be.equal(identifierType.id);
      });
    });

    describe('Product Ids can be removed', function () {
      beforeEach(async function () {
        await lineEditPage.removeProductIdsButton.click();
      });

      it('Product Ids fields are removed', function () {
        expect(lineEditPage.removeProductIdsButton.isPresent).to.be.false;
      });
    });
  });

  describe('Check not negative locations quantity validation', function () {
    const NEGATIVE_QUANTITY = -1;

    beforeEach(async function () {
      await lineEditPage.locationAccordion.physicalQuantity.fill(NEGATIVE_QUANTITY);
      await lineEditPage.locationAccordion.electronicQuantity.fill(NEGATIVE_QUANTITY);
      await lineEditPage.updateLineButton.click();
    });

    it('Should provide warning messages', function () {
      expect(lineEditPage.locationAccordion.warningMessage).to.be.equal('Quantity can not be less than 0');
    });
  });

  it('Has to render expected title', function () {
    expect(lineEditPage.title).to.be.equal(`Edit - ${line.poLineNumber}`);
  });

  describe('Check existing warning messages for Item Details Title if value isn\'t empty', function () {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle(TITLE);
      await lineEditPage.updateLineButton.click();
    });

    it('Doesn\'t provide any warning message', function () {
      expect(lineEditPage.itemDetailsAccordion.errorTitle).to.be.equal('');
    });
  });

  describe('Check existing warning messages for Item Details Title if value is empty', function () {
    beforeEach(async function () {
      await lineEditPage.quantityPhysical.fill(20);
      await lineEditPage.itemDetailsAccordion.inputTitle('');
      await lineEditPage.updateLineButton.click();
    });

    it('Provides title warning message in case if tile is empty', function () {
      expect(lineEditPage.itemDetailsAccordion.errorTitle).to.be.equal(requiredField);
    });
  });
  describe('Other Resource Details accordion is shown', function () {
    beforeEach(async function () {
      await lineEditPage.orderFormat.select(OTHER);
      await lineEditPage.otherAccordion.clickHeader();
    });

    it('Displays create inventory field', function () {
      expect(lineEditPage.physicalCreateInventory.isSelect).to.be.true;
    });

    it('Displays order format Other', function () {
      expect(lineEditPage.orderFormat.value).to.be.equal(OTHER);
    });

    beforeEach(async function () {
      await lineEditPage.physicalCreateInventory.select(INVENTORY_RECORDS_TYPE.all);
      await lineEditPage.updateLineButton.click();
    });

    it('Displays warning message Required for Material Type', function () {
      expect(lineEditPage.otherAccordion.warningMessage).to.be.equal(requiredField);
    });

    it('Create inventory field includes Instance, Holding, Item', function () {
      expect(lineEditPage.physicalCreateInventory.value).to.be.equal(INVENTORY_RECORDS_TYPE.all);
    });
  });
});
