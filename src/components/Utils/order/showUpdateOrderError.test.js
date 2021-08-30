import showUpdateOrderError from './showUpdateOrderError';

const params = {
  response: {
    errors: [{
      code: 'errorCode',
    }],
  },
  callout: {
    sendCallout: jest.fn(),
  },
  openModal: jest.fn(),
};

describe('showUpdateOrderError', () => {
  it('should handle error and open modal', async () => {
    const response = {
      errors: [{
        code: 'vendorIsInactive',
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.openModal).toHaveBeenCalled();
  });

  it('should handle error and show message', async () => {
    const response = {
      errors: [{
        code: 'missingInstanceStatus',
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle default error case', async () => {
    showUpdateOrderError(...Object.values(params));

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });
});
