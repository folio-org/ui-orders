import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import { WORKFLOW_STATUS } from '../../../../src/common/constants';
import {
  CONFIG_CLOSING_REASONS,
  MODULE_ORDERS,
} from '../../../../src/components/Utils/const';

const REASON = 'test reason';

describe('Close Order is enabled', function () {
  setupApplication();

  let order = null;
  const page = new OrderDetailsPage();

  beforeEach(async function () {
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
    });

    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_CLOSING_REASONS,
      enabled: true,
      value: REASON,
      code: 'CLOSING_REASON_1',
    });

    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  it('displays Close Order button', () => {
    expect(page.closeOrderButton.isButton).to.be.true;
    expect(page.closeReasonBlock).to.be.false;
  });
});
