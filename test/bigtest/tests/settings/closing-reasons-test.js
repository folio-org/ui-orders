import { find } from 'lodash';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../../../../src/common/constants';

import setupApplication from '../../helpers/setup-application';
import ClosingReasons from '../../interactors/settings/ClosingReasons/ClosingReasons';
import {
  CONFIG_CLOSING_REASONS,
  MODULE_ORDERS,
} from '../../../../src/components/Utils/const';

describe('Setting of Closing Reasons', function () {
  const closingReasons = new ClosingReasons();
  const defaultReasonsCount = Object.keys(DEFAULT_CLOSE_ORDER_REASONS).length;

  setupApplication();

  beforeEach(async function () {
    this.server.create('configs', {
      module: MODULE_ORDERS,
      configName: CONFIG_CLOSING_REASONS,
      enabled: true,
      value: 'test reason',
      code: 'CLOSING_REASON_1',
    });
    this.visit('/settings/orders/closing-reasons');
    await closingReasons.whenLoaded();
  });

  it('renders page correctly', () => {
    expect(closingReasons.isPresent).to.be.true;
    expect(closingReasons.isOrdersListPresent).to.be.true;
  });

  it('should render Add button', () => {
    expect(closingReasons.addClosingReason.isPresent).to.be.true;
  });

  describe('button click', () => {
    beforeEach(async () => {
      await closingReasons.addClosingReason.addAction();
    });

    it('should open Closing Reason form', () => {
      expect(closingReasons.addClosingReason.closingReasonForm.isPresent).to.be.true;
    });
  });

  describe('form', () => {
    beforeEach(async () => {
      await closingReasons.addClosingReason.addAction();
    });

    describe('submit action', () => {
      beforeEach(async () => {
        await closingReasons.addClosingReason.closingReasonForm.fillValue('test value');
        await closingReasons.addClosingReason.closingReasonForm.submitAction();
      });

      it('should hide Closing Reason form', () => {
        expect(closingReasons.addClosingReason.closingReasonForm.isPresent).to.be.false;
        expect(closingReasons.addClosingReason.isPresent).to.be.true;
      });
    });

    describe('cancel action', () => {
      beforeEach(async () => {
        await closingReasons.addClosingReason.closingReasonForm.cancelAction();
      });

      it('should hide Closing Reason form', () => {
        expect(closingReasons.addClosingReason.closingReasonForm.isPresent).to.be.false;
        expect(closingReasons.addClosingReason.isPresent).to.be.true;
      });
    });
  });

  it('should display all system reasons', () => {
    expect(closingReasons.systemReasons().length === defaultReasonsCount).to.be.true;
  });

  it('should hide actions', () => {
    closingReasons.systemReasons().forEach(reason => {
      expect(reason.editAction().length).to.equal(0);
    });
  });

  it('should display loaded reasons', () => {
    expect(closingReasons.reasons().length > defaultReasonsCount).to.be.true;
  });

  describe('Remove action', () => {
    beforeEach(async () => {
      await (
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        })
      );

      const userReason = find(closingReasons.reasons(), reason => reason.removeAction().length);

      await userReason.removeAction(0).click();
    });

    it('should refresh items after success', () => {
      expect(closingReasons.reasons().length > defaultReasonsCount).to.be.true;
    });
  });

  describe('Edit action', () => {
    beforeEach(async () => {
      await (
        new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        })
      );

      const userReason = find(closingReasons.reasons(), reason => reason.editAction().length);

      await userReason.editAction(0).click();
    });

    it('should open Closing Reason form', () => {
      expect(closingReasons.closingReasonItem.closingReasonForm.isPresent).to.be.true;
    });

    describe('submit action', () => {
      beforeEach(async () => {
        await closingReasons.closingReasonItem.closingReasonForm.fillValue('test value');
        await closingReasons.closingReasonItem.closingReasonForm.submitAction();
      });

      it('should hide Closing Reason form', () => {
        expect(closingReasons.closingReasonItem.closingReasonForm.isPresent).to.be.false;
      });
    });

    describe('cancel action', () => {
      beforeEach(async () => {
        await closingReasons.closingReasonItem.closingReasonForm.cancelAction();
      });

      it('should hide Closing Reason form', () => {
        expect(closingReasons.closingReasonItem.closingReasonForm.isPresent).to.be.false;
      });
    });
  });
});
