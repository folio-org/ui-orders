import { isRequestTooLargeError } from './isRequestTooLargeError';

describe('isRequestTooLargeError', () => {
  it('should return true for 414 status code', () => {
    const response = { status: 414 };

    expect(isRequestTooLargeError(response)).toBe(true);
  });

  it('should return true for 431 status code', () => {
    const response = { status: 431 };

    expect(isRequestTooLargeError(response)).toBe(true);
  });

  it('should return false for other status codes', () => {
    const response = { status: 400 };

    expect(isRequestTooLargeError(response)).toBe(false);
  });

  it('should return false for undefined response', () => {
    expect(isRequestTooLargeError(undefined)).toBe(false);
  });

  it('should return false for response without status', () => {
    const response = {};

    expect(isRequestTooLargeError(response)).toBe(false);
  });
});
