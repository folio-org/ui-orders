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

import prefixKeys from '@folio/stripes-acq-components/test/bigtest/helpers/prefixKeys';

import OpenOrderErrorModal from '../../interactors/PurchaseOrder/open-order-error-modal';
import { UpdateOrderErrorModal } from '../../../../src/components/PurchaseOrder/UpdateOrderErrorModal';
import { ERROR_CODES } from '../../../../src/common/constants';
import translations from '../../../../translations/ui-orders/en';

describe('Update Order Error modal', () => {
  let cancelFake;
  let updateOrderErrorModal;

  beforeEach(() => {
    cancelFake = sinon.fake();
    updateOrderErrorModal = new OpenOrderErrorModal();

    mount(() => (
      <IntlProvider locale="en" key="en" timeZone="UTC" messages={prefixKeys(translations, 'ui-orders')}>
        <UpdateOrderErrorModal
          cancel={cancelFake}
          orderNumber="123"
          errors={[{ code: ERROR_CODES.vendorIsInactive }]}
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
