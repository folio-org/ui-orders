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
  it('should handle error and open modal', () => {
    const response = {
      errors: [{
        code: 'vendorIsInactive',
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.openModal).toHaveBeenCalled();
  });

  it('should handle error and show message', () => {
    const response = {
      errors: [{
        code: 'missingInstanceStatus',
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle `fundLocationRestrictionViolation` error and show message', () => {
    const response = {
      errors: [{
        code: 'fundLocationRestrictionViolation',
        parameters: [{
          key: 'poLineNumber',
          value: 'value',
        }],
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle `budgetExpenseClassNotFound` error and show message', () => {
    const response = {
      errors: [{
        code: 'budgetExpenseClassNotFound',
        parameters: [{
          key: 'fundCode',
          value: 'value',
        }, {
          key: 'expenseClassName',
          value: 'value',
        }],
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle `budgetNotFoundForFiscalYear` error and show message', () => {
    const response = {
      errors: [{
        code: 'budgetNotFoundForFiscalYear',
        parameters: [{
          key: 'fundCodes',
          value: '[AB,CD]',
        }],
      }],
    };

    showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle default error case', () => {
    showUpdateOrderError(...Object.values(params));

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });
});
