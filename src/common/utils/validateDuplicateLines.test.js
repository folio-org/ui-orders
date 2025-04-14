import { VALIDATION_ERRORS, PRODUCT_ID_TYPE } from '../constants';
import { validateDuplicateLines } from './validateDuplicateLines';

describe('validateDuplicateLines', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      poLines: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
      orders: {
        GET: jest.fn(),
      },
    };
  });

  const resources = {
    identifierTypes: {
      records: [{ name: PRODUCT_ID_TYPE.isbn, id: 'productIdIsbnType' }],
    },
  };

  const line = {
    id: 'id',
    titleOrPackage: 'Title',
    details: {
      productIds: [
        { productId: 'productIdIsbn', productIdType: 'productIdIsbnType' },
        { productId: 'productId', productIdType: 'productIdType' },
      ],
    },
  };

  it('should call only poLines mutator', async () => {
    mutator.poLines.GET.mockClear().mockReturnValue(Promise.resolve([]));

    await validateDuplicateLines(line, mutator);

    expect(mutator.poLines.GET).toHaveBeenCalled();
    expect(mutator.orders.GET).not.toHaveBeenCalled();
  });

  it('should return error', async () => {
    mutator.poLines.GET.mockClear().mockReturnValue(Promise.resolve([{ purchaseOrderId: 'purchaseOrderId' }]));
    mutator.orders.GET.mockClear().mockReturnValue(Promise.resolve({ id: 'purchaseOrderId' }));

    let error;

    try {
      await validateDuplicateLines(line, mutator);
    } catch (e) {
      error = e.validationError;
    }

    expect(error).toBe(VALIDATION_ERRORS.duplicateLines);
  });
});
