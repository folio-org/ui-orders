import asyncValidate from './asyncValidate';

const values = {
  details: {
    productIds: [{
      productIdType: 'identifierTypeId',
    }],
  },
  blurredField: '',
  productIdType: 'identifierTypeId',
};
const dispatch = jest.fn();
const validationMock = jest.fn();
const props = {
  parentMutator: {
    validateISBN: {
      GET: validationMock,
    },
  },
  parentResources: {
    identifierTypes: {
      records: [{
        id: 'identifierTypeId',
        name: 'ISBN',
      }],
    },
  },
};
const blurredField = 'productIdType';

describe('asyncValidate', () => {
  it('should not return validation errors if data is valid', async () => {
    validationMock.mockResolvedValue({
      isValid: true,
    });
    const error = await asyncValidate(values, dispatch, props, blurredField);

    expect(error).toBeUndefined();
  });

  it('should return validation errors if ISBN is invalid', async () => {
    let thrownError;

    validationMock.mockResolvedValue({ isValid: false });

    try {
      thrownError = await asyncValidate(values, dispatch, props, blurredField);
    } catch (error) {
      thrownError = error;
    }

    expect(JSON.stringify(thrownError)).toEqual(expect.stringContaining('ui-orders.errors.invalidProductId'));
  });
});
