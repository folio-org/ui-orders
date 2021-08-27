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
const props = {
  parentMutator: {
    validateISBN: {
      GET: jest.fn().mockResolvedValue({
        isValid: true,
      }),
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
    const error = await asyncValidate(values, dispatch, props, blurredField);

    expect(error).toBeUndefined();
  });
});
