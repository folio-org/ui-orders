import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import OrderLinesInteractor from '../../interactors/order-lines';
import { PRODUCT_ID_TYPE } from '../../../../src/common/constants';

const ORDER_LINES_COUNT = 11;

describe('Order lines', function () {
  setupApplication();

  const orderLines = new OrderLinesInteractor();

  beforeEach(async function () {
    this.server.createList('line', ORDER_LINES_COUNT);
    this.server.create('identifierType', { name: PRODUCT_ID_TYPE.isbn });
    this.visit('/orders/lines');
    await orderLines.whenLoaded();
  });

  it('is no results message label present', () => {
    expect(orderLines.isNoResultsMessageLabelPresent).to.equal(true);
  });

  describe('search by poNumber', function () {
    beforeEach(async function () {
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('shows the list of order line items', () => {
      expect(orderLines.isVisible).to.equal(true);
    });

    it('renders each order line', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('navigation', () => {
    it('should be present', () => {
      expect(orderLines.navigation.isPresent).to.be.true;
    });
  });

  describe('renders search button', () => {
    it('search button is disabled', () => {
      expect(orderLines.filter.searchButton.isDisabled).to.be.true;
    });
  });

  describe('filter by metadata.createdDate', function () {
    beforeEach(async function () {
      await orderLines.filter.fillCreatedDateStart('2019-01-01');
      await orderLines.filter.fillCreatedDateEnd('2019-08-01');
      await orderLines.filter.applyCreatedDate.click();
    });

    it('should load list without errors', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  it('renders expanded payment status filter', () => {
    expect(orderLines.filter.accordionPaymentStatus.isExpanded).to.be.true;
  });

  it('renders expanded receipt status filter', () => {
    expect(orderLines.filter.accordionReceiptStatus.isExpanded).to.be.true;
  });

  it('renders collapsed created date filter', () => {
    expect(orderLines.filter.accordionCreatedDate.isExpanded).to.be.false;
  });

  describe('search by keyword', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('Keyword');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('search by title', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('Title');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('search by publisher', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('Publisher');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('search by donor', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('Donor');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('search by selector', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('Selector');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('search by volume', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('Volumes');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });

  describe('search by product ID type ISBN', function () {
    beforeEach(async function () {
      await orderLines.filter.selectSearchOption('- ISBN');
      await orderLines.filter.searchInput('TEST');
      await orderLines.filter.searchButton.click();
    });

    it('search results are shown', () => {
      expect(orderLines.instances().length).to.be.equal(ORDER_LINES_COUNT);
    });
  });
});
