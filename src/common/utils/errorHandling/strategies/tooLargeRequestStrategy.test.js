import { ERROR_CODES } from '../../../constants';
import { tooLargeRequestStrategy } from './tooLargeRequestStrategy';

describe('tooLargeRequestStrategy', () => {
  it('should return a handler with handle function', () => {
    const callout = {
      sendCallout: jest.fn(),
    };
    const strategy = tooLargeRequestStrategy({ callout });

    expect(strategy).toHaveProperty('handle');
    expect(typeof strategy.handle).toBe('function');
  });

  it('should call sendCallout with correct parameters when handle is called', () => {
    const callout = {
      sendCallout: jest.fn(),
    };
    const strategy = tooLargeRequestStrategy({ callout });

    strategy.handle();

    expect(callout.sendCallout).toHaveBeenCalledWith({
      messageId: `ui-orders.errors.${ERROR_CODES.tooLargeRequest}`,
      type: 'error',
    });
  });
});
