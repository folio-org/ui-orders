import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import { showUpdateOrderError, ERROR_CODES } from '../../../../../src/components/Utils/order';

const CALLOUT_ERROR_CODES =
  Object
    .keys(ERROR_CODES)
    .filter(item => item !== ERROR_CODES.vendorIsInactive && item !== ERROR_CODES.vendorNotFound);

describe('showUpdateOrderError', () => {
  CALLOUT_ERROR_CODES.forEach(errorCode => {
    describe(`process callout for ${errorCode} error`, () => {
      let fakeCallout;
      let fakeResponse;
      let fakeOpenModal;

      beforeEach(async () => {
        fakeCallout = {
          sendCallout: sinon.spy(),
        };
        fakeResponse = {
          json: () => ({
            errors: [
              {
                code: errorCode,
              },
            ],
          }),
        };
        fakeOpenModal = sinon.spy();

        await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
      });

      it('call callout with right error', () => {
        expect(fakeCallout.sendCallout.firstCall.args[0].message.props.id).to.equal(`ui-orders.errors.${errorCode}`);
      });
    });
  });

  describe('process modal for vendorIsInactive', () => {
    let fakeCallout;
    let fakeResponse;
    let fakeOpenModal;

    beforeEach(async () => {
      fakeCallout = {
        sendCallout: sinon.spy(),
      };
      fakeResponse = {
        json: () => ({
          errors: [
            {
              code: ERROR_CODES.vendorIsInactive,
            },
          ],
        }),
      };
      fakeOpenModal = sinon.spy();

      await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
    });

    it('call open error modal with vendorIsInactive error code', () => {
      expect(fakeOpenModal.args[0][0]).to.equal(ERROR_CODES.vendorIsInactive);
    });
  });

  describe('process modal for vendorNotFound', () => {
    let fakeCallout;
    let fakeResponse;
    let fakeOpenModal;

    beforeEach(async () => {
      fakeCallout = {
        sendCallout: sinon.spy(),
      };
      fakeResponse = {
        json: () => ({
          errors: [
            {
              code: ERROR_CODES.vendorNotFound,
            },
          ],
        }),
      };
      fakeOpenModal = sinon.spy();

      await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
    });

    it('call open error modal with vendorNotFound error code', () => {
      expect(fakeOpenModal.args[0][0]).to.equal(ERROR_CODES.vendorNotFound);
    });
  });
});
