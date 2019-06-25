import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import OrderTemplatesList from '../../../interactors/settings/OrderTemplates/OrderTemplatesList';
import OrderTemplateView from '../../../interactors/settings/OrderTemplates/OrderTemplateView';
import OrderTemplatesEditor from '../../../interactors/settings/OrderTemplates/OrderTemplatesEditor';
import {
  CONFIG_ORDER_TEMPLATES,
  MODULE_ORDERS,
} from '../../../../../src/components/Utils/const';
import ConfirmationModal from '../../../interactors/confirmation';

describe('Order template view', function () {
  setupApplication();

  const orderTemplatesList = new OrderTemplatesList();
  const orderTemplateView = new OrderTemplateView();
  const orderTemplateForm = new OrderTemplatesEditor();

  beforeEach(async function () {
    this.server.create('configs', {
      module: MODULE_ORDERS,
      configName: CONFIG_ORDER_TEMPLATES,
      enabled: true,
      value: '{"templateName":"TEST TEMPLATE"}',
    });
    this.visit('/settings/orders/order-templates');
    await orderTemplatesList.whenLoaded();
    await orderTemplatesList.list(0).click();
  });

  it('should redirect to view screen', () => {
    expect(orderTemplateView.isPresent).to.be.true;
  });

  it('actions should be present', () => {
    expect(orderTemplateView.actions.isPresent).to.be.true;
  });

  it('template info accordion is expanded', () => {
    expect(orderTemplateView.templateInfoAccordion.isExpanded).to.be.true;
  });

  describe('click delete button', () => {
    const deleteConfirmation = new ConfirmationModal('#delete-order-template-modal');

    beforeEach(async function () {
      await orderTemplateView.paneHeaderCenterButton.click();
      await orderTemplateView.deleteButton.click();
    });

    it('confirmation modal for delete should be presented', () => {
      expect(deleteConfirmation.isPresent).to.be.true;
    });

    describe('click confirm delete button', () => {
      beforeEach(async function () {
        await deleteConfirmation.confirm();
      });

      it('should redirect to Order templates list', () => {
        expect(orderTemplatesList.isPresent).to.be.true;
      });
    });

    describe('click cancel delete button', () => {
      beforeEach(async function () {
        await deleteConfirmation.cancel();
      });

      it('confirmation modal for delete should disappear', () => {
        expect(deleteConfirmation.isPresent).to.be.false;
      });
    });
  });

  describe('click edit button', () => {
    beforeEach(async function () {
      await orderTemplateView.paneHeaderCenterButton.click();
      await orderTemplateView.editButton.click();
    });

    it('should redirect to edit screen', () => {
      expect(orderTemplateForm.isPresent).to.be.true;
      expect(orderTemplateForm.title).to.include('TEST TEMPLATE');
    });
  });

  describe('collapse template info accordion', () => {
    beforeEach(async function () {
      await orderTemplateView.templateInfoAccordion.clickHeader();
    });

    it('template info accordion is collapsed', () => {
      expect(orderTemplateView.templateInfoAccordion.isExpanded).to.be.false;
    });
  });
});
