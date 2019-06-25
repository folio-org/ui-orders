import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../../helpers/setup-application';
import OrderTemplatesList from '../../../interactors/settings/OrderTemplates/OrderTemplatesList';
import {
  CONFIG_ORDER_TEMPLATES,
  MODULE_ORDERS,
} from '../../../../../src/components/Utils/const';

describe('Settings - Order templates - list', function () {
  setupApplication();

  const orderTemplatesList = new OrderTemplatesList();

  beforeEach(async function () {
    this.server.create('configs', {
      module: MODULE_ORDERS,
      configName: CONFIG_ORDER_TEMPLATES,
      enabled: true,
      value: '{"templateName":"TEST TEMPLATE"}',
    });
    this.visit('/settings/orders/order-templates');
    await orderTemplatesList.whenLoaded();
  });

  it('should be present', () => {
    expect(orderTemplatesList.isPresent).to.be.true;
    expect(orderTemplatesList.list().length).to.be.equal(1);
  });
});
