import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import OrderTemplatesList from '../../../interactors/settings/OrderTemplates/OrderTemplatesList';
import OrderTemplateView from '../../../interactors/settings/OrderTemplates/OrderTemplateView';

describe('Settings - Order templates - list', function () {
  setupApplication();

  const orderTemplatesList = new OrderTemplatesList();
  const orderTemplateView = new OrderTemplateView();

  beforeEach(async function () {
    this.server.createList('orderTemplate', 10);
    this.visit('/settings/orders/order-templates');
    await orderTemplatesList.whenLoaded();
  });

  it('should be present', () => {
    expect(orderTemplatesList.isPresent).to.be.true;
    expect(orderTemplatesList.list().length).to.be.equal(10);
  });

  describe('click on template', () => {
    beforeEach(async function () {
      await orderTemplatesList.list(0).click();
      await orderTemplateView.whenLoaded();
    });

    it('should redirect to view screen', () => {
      expect(orderTemplateView.isPresent).to.be.true;
    });
  });
});
