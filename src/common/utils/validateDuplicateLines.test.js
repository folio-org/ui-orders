import { VALIDATION_ERRORS } from '../constants';
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

  it('should call only poLines mutator', async () => {
    const line = { id: 'id', titleOrPackage: 'Title', details: { productIds: [{ productId: 'productId' }] } };

    mutator.poLines.GET.mockClear().mockReturnValue(Promise.resolve([]));

    await validateDuplicateLines(line, mutator);

    expect(mutator.poLines.GET).toHaveBeenCalled();
    expect(mutator.orders.GET).not.toHaveBeenCalled();
  });

  it('should return error', async () => {
    const line = { id: 'id', titleOrPackage: 'Title', details: { productIds: [{ productId: 'productId' }] } };

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
