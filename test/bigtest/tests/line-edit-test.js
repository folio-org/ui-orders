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

import {
  CONFIG_OPEN_ORDER,
  MODULE_ORDERS,
} from '../../../src/components/Utils/const';
import calculateEstimatedPrice from '../../../src/components/POLine/calculateEstimatedPrice';
import {
  PRODUCT_ID_TYPE,
  WORKFLOW_STATUS,
} from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import LineEditPage from '../interactors/line-edit-page';
import LineDetailsPage from '../interactors/line-details-page';
import OrderDetailsPage from '../interactors/order-details-page';
import { TIMEOUT } from '../interactors/const';
import { CalloutInteractor } from '../interactors';

const TITLE = 'TEST_VALUE';
// const requiredField = 'Required!';
// const validationYearMessage = 'Field should be 4-digit year';
const LIST_UNIT_PRICE = 1.1;
const QUANTITY_PHYSICAL = 2;
const cost = {
  currency: 'USD',
  listUnitPrice: LIST_UNIT_PRICE,
  quantityPhysical: QUANTITY_PHYSICAL,
};
const LINE_ESTIMATED_PRICE = calculateEstimatedPrice({ cost });

describe('Line edit test', function () {
  setupApplication();

  this.timeout(TIMEOUT);

  let order = null;
  let line = null;
  let location = null;
  let locations = null;
  let vendor = null;
  let contributorNameType = null;
  let identifierType = null;
  let materialTypes = null;
  const lineEditPage = new LineEditPage();
  const lineDetailsPage = new LineDetailsPage();
  const orderDetailsPage = new OrderDetailsPage();
  const calloutInteractor = new CalloutInteractor();

  beforeEach(async function () {
    vendor = this.server.create('vendor');
    location = this.server.create('location');
    contributorNameType = this.server.create('contributor-name-type');
    identifierType = this.server.create('identifier-type', {
      name: PRODUCT_ID_TYPE.isbn,
    });
    materialTypes = this.server.createList('material-type', 2);

    locations = [
      {
        locationId: location.attrs.id,
        quantityPhysical: QUANTITY_PHYSICAL,
        quantityElectronic: 0,
      },
    ];

    line = this.server.create('line', {
      acquisitionMethod: ACQUISITION_METHOD.purchase,
      orderFormat: ORDER_FORMATS.physicalResource,
      cost,
      locations,
      titleOrPackage: 't',
      physical: {
        createInventory: INVENTORY_RECORDS_TYPE.all,
        materialType: materialTypes[0].id,
      },
      checkinItems: false,
    });

    order = this.server.create('order', {
      vendor: vendor.id,
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
      approved: true,
      workflowStatus: WORKFLOW_STATUS.pending,
    });

    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_OPEN_ORDER,
      enabled: true,
      value: '{"isOpenOrderEnabled":true}',
    });

    this.visit(`/orders/view/${order.id}/po-line/edit/${line.id}`);
    await lineEditPage.whenLoaded();
  });

  it('displays Line Edit form', function () {
    expect(lineEditPage.$root).to.exist;
    expect(lineEditPage.locationAccordion.$root).to.exist;
    expect(lineEditPage.fundDistributionAccordion.$root).to.exist;
    expect(lineEditPage.updateLineButton.isButton).to.be.true;
    expect(lineEditPage.publicationDateField.isInput).to.be.true;
    expect(lineEditPage.orderFormat.isSelect).to.be.true;
    expect(lineEditPage.saveAndOpenButton.isButton).to.be.true;
    expect(lineEditPage.hasTemplateField).to.be.false;
    expect(lineEditPage.listUnitPrice.isInput).to.be.true;
    expect(lineEditPage.quantityPhysical.isInput).to.be.true;
    expect(lineEditPage.additionalCost.isInput).to.be.true;
    expect(lineEditPage.listUnitPriceElectronic.isInput).to.be.true;
    expect(lineEditPage.discount.isInput).to.be.true;
    expect(lineEditPage.quantityElectronic.isInput).to.be.true;
    expect(lineEditPage.poLineEstimatedPrice.$root).to.exist;
    expect(lineEditPage.title).to.be.equal(`Edit - ${line.poLineNumber}`);
    expect(lineEditPage.poLineEstimatedPrice.value).to.include(LINE_ESTIMATED_PRICE);
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
      await lineEditPage.publicationDateField.focus();
      await lineEditPage.publicationDateField.fill('111').focus();
      await lineEditPage.publicationDateField.blur();
      await lineEditPage.updateLineButton.focus().click();
      await lineEditPage.updateLineButton.blur();
    });

    // it('displays required and error messages', function () {
    //   expect(lineEditPage.validationMessage).to.include(validationYearMessage);
    // });

    it.always('stays on the form', function () {
      expect(lineEditPage.$root).to.exist;
    });
  });

  describe('Enter valid publication date', function () {
    beforeEach(async function () {
      await lineEditPage.publicationDateField.focus();
      await lineEditPage.publicationDateField.fill('2019');
      await lineEditPage.publicationDateField.blur();
      await lineEditPage.updateLineButton.click();
      await lineDetailsPage.whenLoaded();
    });

    // it('displays only required validation message', function () {
    //   expect(lineEditPage.validationMessage).to.include(requiredField);
    // });

    it('goes to line details', function () {
      expect(lineDetailsPage.$root).to.exist;
    });
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
        await lineEditPage.whenLoaded();
      });

      it('Volume is removed', function () {
        expect(lineEditPage.removeVolumeButton.isPresent).to.be.false;
      });
    });
  });

  describe('Contributor can be added', function () {
    beforeEach(async function () {
      await lineEditPage.addContributorButton.click();
    });

    it('contributor is added', function () {
      expect(lineEditPage.itemDetailsAccordion.contributorNames().length).to.be.equal(1);
      expect(lineEditPage.itemDetailsAccordion.contributorTypes().length).to.be.equal(1);
      expect(lineEditPage.itemDetailsAccordion.contributorType.isSelect).to.be.true;
      expect(lineEditPage.itemDetailsAccordion.contributorName.isInput).to.be.true;
    });

    describe('contributor can be updated', function () {
      const testName = 'test name';

      beforeEach(async function () {
        await lineEditPage.itemDetailsAccordion.contributorName.fill(testName);
        await lineEditPage.itemDetailsAccordion.contributorType.select(contributorNameType.attrs.name);
      });

      it('contributor is updated', function () {
        expect(lineEditPage.itemDetailsAccordion.contributorName.value).to.be.equal(testName);
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
      await lineEditPage.addProductIdsButton.click();
    });

    it('product Ids fields are added', function () {
      expect(lineEditPage.itemDetailsAccordion.productIds().length).to.be.equal(1);
      expect(lineEditPage.itemDetailsAccordion.productIdTypes().length).to.be.equal(1);
      expect(lineEditPage.itemDetailsAccordion.productIdType.isSelect).to.be.true;
      expect(lineEditPage.itemDetailsAccordion.productId.isInput).to.be.true;
    });

    describe('product Ids can be updated', function () {
      const testName = 'test name';

      beforeEach(async function () {
        await lineEditPage.itemDetailsAccordion.productId.fillAndBlur(testName);
        await lineEditPage.itemDetailsAccordion.productIdType.select(identifierType.name);
      });

      it('product Id is updated', function () {
        expect(lineEditPage.itemDetailsAccordion.productId.value).to.be.equal(testName);
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
      await lineEditPage.locationAccordion.physicalQuantity.focus();
      await lineEditPage.locationAccordion.physicalQuantity.fill(NEGATIVE_QUANTITY).focus();
      await lineEditPage.locationAccordion.physicalQuantity.blur();
      await lineEditPage.locationAccordion.electronicQuantity.focus();
      await lineEditPage.locationAccordion.electronicQuantity.fill(NEGATIVE_QUANTITY).focus();
      await lineEditPage.locationAccordion.electronicQuantity.blur();
      await lineEditPage.updateLineButton.focus().click();
      await lineEditPage.updateLineButton.blur();
    });

    // it('Should provide warning messages', function () {
    //   expect(lineEditPage.locationAccordion.warningMessage).to.be.equal('Quantity can not be less than 0');
    // });

    it.always('stays on the form', function () {
      expect(lineEditPage.$root).to.exist;
    });
  });

  describe('Check existing warning messages for Item Details Title if value isn\'t empty', function () {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle(TITLE);
      await lineEditPage.updateLineButton.click();
    });

    it('Doesnt provide any warning message', function () {
      expect(lineEditPage.itemDetailsAccordion.inputTitleError.isPresent).to.be.false;
    });
  });

  describe('Check existing warning messages for Item Details Title if value is empty', function () {
    beforeEach(async function () {
      await lineEditPage.quantityPhysical.fill(20);
      await lineEditPage.itemDetailsAccordion.inputTitle('');
      await lineEditPage.itemDetailsAccordion.inputTitleField.focus();
      await lineEditPage.updateLineButton.focus();
      await lineEditPage.itemDetailsAccordion.whenErrorIsPresent();
    });

    // it('Provides title warning message in case if tile is empty', function () {
    //   expect(lineEditPage.itemDetailsAccordion.inputTitleErrorText.to.be.equal(requiredField);
    // });

    it.always('stays on the form', function () {
      expect(lineEditPage.$root).to.exist;
    });
  });

  describe('Other Resource Details accordion is shown', function () {
    beforeEach(async function () {
      await lineEditPage.orderFormat.select(ORDER_FORMATS.other);
      await lineEditPage.otherAccordion.clickHeader();
    });

    it('Displays create inventory field', function () {
      expect(lineEditPage.physicalCreateInventory.isSelect).to.be.true;
      expect(lineEditPage.orderFormat.value).to.be.equal(ORDER_FORMATS.other);
    });

    describe('Other Resource Details accordion is shown', function () {
      beforeEach(async function () {
        await lineEditPage.physicalCreateInventory.select('Instance, holdings, item');
        await lineEditPage.updateLineButton.click();
      });

      it('Displays warning message Required for Material Type', function () {
        // expect(lineEditPage.otherAccordion.warningMessage).to.be.equal(requiredField);
        expect(lineEditPage.physicalCreateInventory.value).to.be.equal(INVENTORY_RECORDS_TYPE.all);
      });

      it.always('stays on the form', function () {
        expect(lineEditPage.$root).to.exist;
      });
    });
  });

  describe('Save PO Line and open order', function () {
    beforeEach(async function () {
      await lineEditPage.itemDetailsAccordion.inputTitle(TITLE);
      await lineEditPage.quantityPhysical.fill(2);
      await lineEditPage.physicalCreateInventory.select('Instance, holdings, item');
      await lineEditPage.physicalDetailsAccordion.materialType(materialTypes[0].name);
      await lineEditPage.saveAndOpenButton.click();
      await lineDetailsPage.whenLoaded();
    });

    it('POL is saved, PO Line details pane is open', function () {
      expect(calloutInteractor.anyCalloutIsPresent).to.be.true;
      expect(calloutInteractor.list().length).to.equal(2);
      expect(calloutInteractor.list(0).message).to.equal(`The Purchase order - ${order.poNumber} has been successfully opened`);
      expect(calloutInteractor.list(1).message).to.equal(`The purchase order line ${line.poLineNumber} was successfully updated`);
      expect(lineDetailsPage.isPresent).to.be.true;
    });

    describe('go back to order details', function () {
      beforeEach(async function () {
        await lineDetailsPage.goBackToOrderButton.click();
        await orderDetailsPage.whenLoaded();
      });

      it('PO details pane is open', function () {
        expect(orderDetailsPage.isPresent).to.be.true;
        expect(orderDetailsPage.workflowStatus.value).to.contain(WORKFLOW_STATUS.open);
      });
    });
  });
});
