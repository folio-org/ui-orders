import showUpdateOrderError from './showUpdateOrderError';

const getResponseMock = ({ code, message, parameters }) => {
  return {
    clone: jest.fn().mockReturnThis(),
    json: jest.fn().mockResolvedValue({
      errors: [{
        code,
        parameters,
        message,
      }],
    }),
    status: 400,
  };
};

const params = {
  response: getResponseMock({ code: 'genericError' }),
  callout: {
    sendCallout: jest.fn(),
  },
  openModal: jest.fn(),
};

describe('showUpdateOrderError', () => {
  it('should handle error and open modal', async () => {
    const response = getResponseMock({ code: 'vendorIsInactive' });

    await showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.openModal).toHaveBeenCalled();
  });

  it('should handle error and show message', async () => {
    const response = getResponseMock({ code: 'missingInstanceStatus' });

    await showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle `fundLocationRestrictionViolation` error and show message', async () => {
    const response = getResponseMock({
      code: 'fundLocationRestrictionViolation',
      parameters: [{
        key: 'poLineNumber',
        value: 'value',
      }],
    });

    await showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle `budgetExpenseClassNotFound` error and show message', async () => {
    const response = getResponseMock({
      code: 'budgetExpenseClassNotFound',
      parameters: [{
        key: 'fundCode',
        value: 'value',
      }, {
        key: 'expenseClassName',
        value: 'value',
      }],
    });

    await showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle `budgetNotFoundForFiscalYear` error and show message', async () => {
    const response = getResponseMock({
      code: 'budgetNotFoundForFiscalYear',
      parameters: [{
        key: 'fundCodes',
        value: '[1,2]',
      }],
    });

    await showUpdateOrderError(response, params.callout, params.openModal);

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });

  it('should handle default error case', async () => {
    await showUpdateOrderError(...Object.values(params));

    expect(params.callout.sendCallout).toHaveBeenCalled();
  });
});
