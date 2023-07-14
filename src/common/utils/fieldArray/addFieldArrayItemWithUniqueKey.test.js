import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';
import { addFieldArrayItemWithUniqueKey } from './addFieldArrayItemWithUniqueKey';

const fields = {
  push: jest.fn(),
};

describe('addFieldArrayItemWithUniqueKey', () => {
  beforeEach(() => {
    fields.push.mockClear();
  });

  it('should push a new field with unique identifier in an array', () => {
    addFieldArrayItemWithUniqueKey(fields);

    expect(fields.push).toHaveBeenCalledWith({
      [FIELD_ARRAY_ITEM_IDENTIFIER_KEY]: expect.stringMatching(new RegExp(`${FIELD_ARRAY_ITEM_IDENTIFIER_KEY}\\d`)),
    });
  });
});
