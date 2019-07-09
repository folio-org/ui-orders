import React from 'react';
import { IntlProvider } from 'react-intl';
import {
  beforeEach,
  afterEach,
  describe,
  it,
} from '@bigtest/mocha';
import { mount, cleanup } from '@bigtest/react';
import sinon from 'sinon';
import { expect } from 'chai';

import OpenOrderConfirmationModal from '../../../../src/components/PurchaseOrder/OpenOrderConfirmationModal';
import OpenOrderConfirmationModalInteractor from '../../interactors/PurchaseOrder/open-order-confirmation-modal';
import translations from '../../../../translations/ui-orders/en';
import { prefixKeys } from '../../helpers/prefixKeys';

describe('OpenOrderConfirmationModal', () => {
  let submitFake;
  let cancelFake;
  const openOrderConfirmationModalInct = new OpenOrderConfirmationModalInteractor();

  beforeEach(() => {
    cancelFake = sinon.fake();
    submitFake = sinon.fake();

    mount(() => (
      <IntlProvider locale="en" key="en" timeZone="UTC" messages={prefixKeys(translations, 'ui-orders')}>
        <OpenOrderConfirmationModal
          submit={submitFake}
          cancel={cancelFake}
          orderNumber="123"
        />
      </IntlProvider>
    ));
  });

  afterEach(() => cleanup());

  it('is rendered correctly', () => {
    expect(openOrderConfirmationModalInct.hasSubmitButton).to.be.true;
    expect(openOrderConfirmationModalInct.hasCancelButton).to.be.true;
    expect(openOrderConfirmationModalInct.hasContent).to.be.true;
  });

  describe('submit button click', () => {
    beforeEach(async () => {
      await openOrderConfirmationModalInct.submitAction();
    });

    it('should invoke passed property', () => {
      expect(submitFake.callCount).not.to.equal(0);
    });
  });

  describe('cancel button click', () => {
    beforeEach(async () => {
      await openOrderConfirmationModalInct.cancelAction();
    });

    it('should invoke passed property', () => {
      expect(cancelFake.callCount).not.to.equal(0);
    });
  });
});
