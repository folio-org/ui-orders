import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import OrderTemplatesList from '../../../interactors/settings/OrderTemplates/OrderTemplatesList';

describe('Settings - Order templates - list', function () {
  setupApplication();

  const orderTemplatesList = new OrderTemplatesList();

  beforeEach(function () {
    this.visit('/settings/orders/order-templates');
  });

  it('should be present', () => {
    expect(orderTemplatesList.isPresent).to.be.true;
  });
});
