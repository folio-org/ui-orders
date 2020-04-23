import {
  clickable,
  collection,
  fillable,
  interactor,
  Interactor,
  is,
  isPresent,
  property,
  selectable,
  text,
  value,
} from '@bigtest/interactor';

import {
  OptionListInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import Button from './button';
import { ACCORDION_ID } from '../../../src/components/POLine/const';

const ITEM_DETAILS = {
  root: '#itemDetails',
  inputTitle: '[name="titleOrPackage"]',
};

@interactor class QuantityLocationElectronic {
  static defaultScope = '[name$="].quantityElectronic"]';
}

@interactor class QuantityLocationPhysical {
  static defaultScope = '[name$="].quantityPhysical"]';
}

@interactor class LocationAccordion {
  static defaultScope = `#${ACCORDION_ID.location}`;
  clickAddLocationButton = clickable('[data-test-repeatable-field-add-item-button]');
  clickHeader = clickable('[class*=defaultCollapseButton---]');
  locations = collection('[data-test-repeatable-field] [class*=repeatableFieldItem---]');
  warningMessage = text('[class*=feedbackError---]');
  electronicQuantity = new QuantityLocationElectronic();
  physicalQuantity = new QuantityLocationPhysical();
}

@interactor class PublicationDateField {
  static defaultScope = '[name="publicationDate"]';
  isInput = is('input');
}

@interactor class ListUnitPrice {
  static defaultScope = '[name="cost.listUnitPrice"]';
  isInput = is('input');
  value = value();
}

@interactor class QuantityPhysical {
  static defaultScope = '[name="cost.quantityPhysical"]';
  isInput = is('input');
  isDisabled = property('disabled');
}

@interactor class AdditionalCost {
  static defaultScope = '[name="cost.additionalCost"]';
  isInput = is('input');
  isDisabled = property('disabled');
}

@interactor class ListUnitPriceElectronic {
  static defaultScope = '[name="cost.listUnitPriceElectronic"]';
  isInput = is('input');
  isDisabled = property('disabled');
}

@interactor class Discount {
  static defaultScope = '[name="cost.discount"]';
  isInput = is('input');
  isDisabled = property('disabled');
  value = value();
}

@interactor class QuantityElectronic {
  static defaultScope = '[name="cost.quantityElectronic"]';
  isInput = is('input');
  isDisabled = property('disabled');
}

@interactor class PoLineEstimatedPrice {
  static defaultScope = '[data-test-polineestimatedprice]';
  value = text('[class*=kvRoot---]');
}

@interactor class FundDistributionAccordion {
  static defaultScope = `#${ACCORDION_ID.fundDistribution}`;
  clickHeader = clickable('[class*=defaultCollapseButton---]');
  clickAddFundButton = clickable('[data-test-repeatable-field-add-item-button]');
  funds = collection('[data-test-repeatable-field] [class*=repeatableFieldItem---]');
}

@interactor class ContributorType {
  static defaultScope = '[name$="contributorNameTypeId"]';
  isSelect = is('select');
  value = value();
}

@interactor class ContributorName {
  static defaultScope = '[name$="contributor"]';
  isInput = is('input');
  value = value();
}

@interactor class ProductId {
  static defaultScope = '[name$="productId"]';
  isInput = is('input');
  value = value();

  fillAndBlur(val) {
    return this
      .fill(val)
      .blur();
  }
}

@interactor class ProductIdType {
  static defaultScope = '[name$="productIdType"]';
  isSelect = is('select');
  value = value();
}

@interactor class ItemDetailsAccordion {
  static defaultScope = ITEM_DETAILS.root;
  toggle = clickable('[class*=defaultCollapseButton---]');
  inputTitle = fillable(ITEM_DETAILS.inputTitle);
  inputTitleError = new Interactor('[class*=titleWrapper---] [class*=feedbackError---]');
  inputTitleErrorText = text('[class*=titleWrapper---] [class*=feedbackError---]');
  contributorTypes = collection(ContributorType.defaultScope);
  contributorNames = collection(ContributorName.defaultScope);
  contributorName = new ContributorName();
  contributorType = new ContributorType();
  productIds = collection(ProductId.defaultScope, TextFieldInteractor);

  productId = new ProductId();
  productIdTypes = collection(ProductIdType.defaultScope);
  productIdType = new ProductIdType();

  edition = fillable('[name="edition"]');
  publisher = fillable('[name="publisher"]');
  publicationDate = new TextFieldInteractor('[name="publicationDate"]');
}

@interactor class OrderFormat {
  static defaultScope = '[name="orderFormat"]';
  isSelect = is('select');
  value = value();
}

@interactor class Currency {
  value = text('#selected-cost-currency-item');
  options = new OptionListInteractor('#sl-cost-currency');
  button = new Button('[name="cost.currency"]');
}

@interactor class OtherAccordion {
  static defaultScope = `#${ACCORDION_ID.other}`;
  clickHeader = clickable('[class*=defaultCollapseButton---]');
  warningMessage = text('[class*=feedbackError---]');
}

@interactor class PhysicalCreateInventory {
  static defaultScope = '[name="physical.createInventory"]';
  isSelect = is('select');
  value = value();
}

@interactor class PhysicalDetailsAccordion {
  static defaultScope = `#${ACCORDION_ID.physical}`;
  toggle = clickable('[class*=defaultCollapseButton---]');
  materialSupplierPresent = isPresent('[name="physical.materialSupplier"]');
  volumes = collection('[name*="physical.volumes"]');
  materialType = selectable('[name="physical.materialType"]');
}

@interactor class ElectronicDetailsAccordion {
  static defaultScope = `#${ACCORDION_ID.eresources}`;
  toggle = clickable('[class*=defaultCollapseButton---]');

  accessProviderPresent = isPresent('[name="eresource.accessProvider"]');
}

export default interactor(class LineEditPage {
  static defaultScope = '[data-test-line-edit]';
  locationAccordion = new LocationAccordion();
  updateLineButton = new Button('#clickable-updatePoLine');
  saveButton = new Button('[data-test-button-save]')
  saveAndOpenButton = new Button('[data-test-button-save-and-open]')
  lineNumberInputValue = value('input[name="poLineNumber"]');
  selectOrderFormat = selectable('[name="orderFormat"]');
  validationMessage = text('[class*=feedbackError---]');
  publicationDateField = new PublicationDateField();
  listUnitPrice = new ListUnitPrice();
  quantityPhysical = new QuantityPhysical();
  additionalCost = new AdditionalCost();
  listUnitPriceElectronic = new ListUnitPriceElectronic();
  discount = new Discount();
  quantityElectronic = new QuantityElectronic();
  poLineEstimatedPrice = new PoLineEstimatedPrice();
  fundDistributionAccordion = new FundDistributionAccordion();
  itemDetailsAccordion = new ItemDetailsAccordion();
  physicalDetailsAccordion = new PhysicalDetailsAccordion();
  electronicDetailsAccordion = new ElectronicDetailsAccordion();
  otherAccordion = new OtherAccordion();
  title = text('#paneHeaderpane-poLineForm-pane-title');
  orderFormat = new OrderFormat();
  physicalCreateInventory = new PhysicalCreateInventory();
  addVolumeButton = new Button('[data-test-add-volume-button]');
  removeVolumeButton = new Button('[data-test-remove-volume-button]');
  addContributorButton = new Button('[data-test-add-contributor-button]');
  removeContributorButton = new Button('button[data-test-remove-contributor-button]');
  accountNumber = value('[name="vendorDetail.vendorAccount"]');
  currency = new Currency();
  subscriptionInterval = value('[name="details.subscriptionInterval"]');
  connectedTitleLabel = isPresent('[data-test-connected-link]');
  addProductIdsButton = new Button('#productIds-add-button');
  removeProductIdsButton = new Button('#productIds [data-test-repeatable-field-remove-item-button]');
  isLoaded = isPresent('#itemDetails');
  hasTemplateField = isPresent('[name="template"]');
  acquisitionMethod = selectable('[name="acquisitionMethod"]');

  whenLoaded() {
    return this.timeout(20000).when(() => this.isLoaded);
  }
});
