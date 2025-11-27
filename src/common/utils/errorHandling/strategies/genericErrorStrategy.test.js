import { ERROR_CODE_GENERIC } from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../../constants';
import { genericErrorStrategy } from './genericErrorStrategy';

describe('genericErrorStrategy', () => {
  const defaultErrorCode = ERROR_CODES.ordersNotLoadedGeneric;
  const intl = {
    formatMessage: jest.fn(({ id, defaultMessage }) => defaultMessage || id),
  };
  const callout = {
    sendCallout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a handler with handle function', () => {
    const strategy = genericErrorStrategy({
      callout,
      defaultErrorCode,
      intl,
    });

    expect(strategy).toHaveProperty('handle');
    expect(typeof strategy.handle).toBe('function');
  });

  it('should use defaultErrorCode when response has generic error code', () => {
    const errorsContainer = {
      getError: jest.fn(() => ({ code: ERROR_CODE_GENERIC })),
    };
    const strategy = genericErrorStrategy({
      callout,
      defaultErrorCode,
      intl,
    });

    strategy.handle(errorsContainer);

    expect(intl.formatMessage).toHaveBeenCalledWith({
      id: `ui-orders.errors.${defaultErrorCode}`,
      defaultMessage: expect.any(String),
    });
    expect(callout.sendCallout).toHaveBeenCalledWith({
      message: expect.any(String),
      type: 'error',
    });
  });

  it('should use specific error code when response has non-generic error code', () => {
    const specificErrorCode = ERROR_CODES.orderNotFound;
    const errorsContainer = {
      getError: jest.fn(() => ({ code: specificErrorCode })),
    };
    const strategy = genericErrorStrategy({
      callout,
      defaultErrorCode,
      intl,
    });

    strategy.handle(errorsContainer);

    expect(intl.formatMessage).toHaveBeenCalledWith({
      id: `ui-orders.errors.${specificErrorCode}`,
      defaultMessage: expect.any(String),
    });
    expect(callout.sendCallout).toHaveBeenCalledWith({
      message: expect.any(String),
      type: 'error',
    });
  });

  it('should call sendCallout with error message and type', () => {
    const errorMessage = 'Test error message';
    const errorsContainer = {
      getError: jest.fn(() => ({ code: ERROR_CODES.orderNotFound })),
    };

    intl.formatMessage.mockReturnValue(errorMessage);

    const strategy = genericErrorStrategy({
      callout,
      defaultErrorCode,
      intl,
    });

    strategy.handle(errorsContainer);

    expect(callout.sendCallout).toHaveBeenCalledWith({
      message: errorMessage,
      type: 'error',
    });
  });

  it('should use default message fallback when specific translation is not available', () => {
    const errorsContainer = {
      getError: jest.fn(() => ({ code: 'unknownErrorCode' })),
    };
    const strategy = genericErrorStrategy({
      callout,
      defaultErrorCode,
      intl,
    });

    strategy.handle(errorsContainer);

    expect(intl.formatMessage).toHaveBeenCalledWith({
      id: 'ui-orders.errors.unknownErrorCode',
      defaultMessage: expect.any(String),
    });
  });
});
