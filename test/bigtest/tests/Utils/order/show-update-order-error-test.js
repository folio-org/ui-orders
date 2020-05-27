import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { omit } from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon';

import { showUpdateOrderError } from '../../../../../src/components/Utils/order';
import { ERROR_CODES } from '../../../../../src/common/constants';

const CALLOUT_ERROR_CODES = omit(
  ERROR_CODES,
  [
    'vendorIsInactive',
    'accessProviderIsInactive',
    'vendorNotFound',
    'accessProviderNotFound',
    'userHasNoPermission',
    ERROR_CODES.piecesNeedToBeDeleted,
  ] // eslint-disable-line comma-dangle
);

describe('showUpdateOrderError', () => {
  Object.keys(CALLOUT_ERROR_CODES).forEach(errorCode => {
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
    const ERRORS = [
      {
        code: ERROR_CODES.vendorIsInactive,
      },
    ];

    beforeEach(async () => {
      fakeCallout = {
        sendCallout: sinon.spy(),
      };
      fakeResponse = {
        json: () => ({
          errors: ERRORS,
        }),
      };
      fakeOpenModal = sinon.spy();

      await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
    });

    it('call open error modal with vendorIsInactive error code', () => {
      expect(fakeOpenModal.args[0][0]).to.eql([ERRORS[0]]);
    });
  });

  describe('process modal for vendorNotFound', () => {
    let fakeCallout;
    let fakeResponse;
    let fakeOpenModal;
    const ERRORS = [
      {
        code: ERROR_CODES.vendorNotFound,
      },
    ];

    beforeEach(async () => {
      fakeCallout = {
        sendCallout: sinon.spy(),
      };
      fakeResponse = {
        json: () => ({
          errors: ERRORS,
        }),
      };
      fakeOpenModal = sinon.spy();

      await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
    });

    it('call open error modal with vendorNotFound error code', () => {
      expect(fakeOpenModal.args[0][0]).to.eql([ERRORS[0]]);
    });
  });

  describe('process modal for accessProviderIsInactive', () => {
    let fakeCallout;
    let fakeResponse;
    let fakeOpenModal;
    const ERRORS = [
      {
        code: ERROR_CODES.accessProviderIsInactive,
        parameters: [
          {
            key: 'poLineNumber',
            value: 'TEST',
          },
        ],
      },
    ];

    beforeEach(async () => {
      fakeCallout = {
        sendCallout: sinon.spy(),
      };
      fakeResponse = {
        json: () => ({
          errors: ERRORS,
        }),
      };
      fakeOpenModal = sinon.spy();

      await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
    });

    it('call open error modal with proper POL number in message', () => {
      expect(fakeOpenModal.args[0][0]).to.eql([{ code: ERRORS[0].code, poLineNumber: ERRORS[0].parameters[0].value }]);
    });
  });

  describe('process modal for multi POL with accessProviderIsInactive', () => {
    let fakeCallout;
    let fakeResponse;
    let fakeOpenModal;
    const ERRORS = [
      {
        code: ERROR_CODES.accessProviderIsInactive,
        parameters: [
          {
            key: 'poLineNumber',
            value: 'TEST',
          },
          {
            key: 'poLineNumber',
            value: 'TEST-1',
          },
        ],
      },
    ];

    beforeEach(async () => {
      fakeCallout = {
        sendCallout: sinon.spy(),
      };
      fakeResponse = {
        json: () => ({
          errors: ERRORS,
        }),
      };
      fakeOpenModal = sinon.spy();

      await showUpdateOrderError(fakeResponse, fakeCallout, fakeOpenModal);
    });

    it('call open error modal with proper POL number in message', () => {
      expect(fakeOpenModal.args[0][0]).to.eql([
        { code: ERRORS[0].code, poLineNumber: ERRORS[0].parameters[0].value },
        { code: ERRORS[0].code, poLineNumber: ERRORS[0].parameters[1].value },
      ]);
    });
  });
});
