import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import OrderTemplatesList from '../../../interactors/settings/OrderTemplates/OrderTemplatesList';
import OrderTemplateView from '../../../interactors/settings/OrderTemplates/OrderTemplateView';
import OrderTemplatesEditor from '../../../interactors/settings/OrderTemplates/OrderTemplatesEditor';
import ConfirmationModal from '../../../interactors/confirmation';

describe('Order template view', function () {
  setupApplication();

  const orderTemplateView = new OrderTemplateView();
  const orderTemplateForm = new OrderTemplatesEditor();
  const orderTemplatesList = new OrderTemplatesList();
  let template = null;

  beforeEach(async function () {
    template = this.server.create('orderTemplate');

    this.visit(`/settings/orders/order-templates/${template.id}/view`);
    await orderTemplateView.whenLoaded();
  });

  it('View screen should be present', () => {
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
      await orderTemplateForm.whenLoaded();
    });

    it('should redirect to edit screen', () => {
      expect(orderTemplateForm.isPresent).to.be.true;
      expect(orderTemplateForm.title).to.include(template.templateName);
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
