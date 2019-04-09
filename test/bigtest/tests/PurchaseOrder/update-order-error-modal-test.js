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
import OpenOrderErrorModal from '../../interactors/PurchaseOrder/open-order-error-modal';
import { UpdateOrderErrorModal } from '../../../../src/components/PurchaseOrder/UpdateOrderErrorModal';

describe('Update Order Error modal', () => {
  let cancelFake;
  let updateOrderErrorModal;

  beforeEach(() => {
    cancelFake = sinon.fake();
    updateOrderErrorModal = new OpenOrderErrorModal();

    mount(() => (
      <IntlProvider locale="en">
        <UpdateOrderErrorModal
          cancel={cancelFake}
          orderNumber="123"
          errorCode="vendorIsInactive"
        />
      </IntlProvider>
    ));
  });

  afterEach(() => cleanup());

  it('render all expected elements', () => {
    expect(updateOrderErrorModal.hasCancelAction).to.be.true;
    expect(updateOrderErrorModal.hasReason).to.be.true;
  });

  describe('cancel button click', () => {
    beforeEach(async () => {
      await updateOrderErrorModal.cancelAction();
    });

    it('proper callback was called', () => {
      expect(cancelFake.callCount).not.to.equal(0);
    });
  });
});
