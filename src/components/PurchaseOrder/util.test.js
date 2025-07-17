import { useIntl } from 'react-intl';
import {
  getPoFieldsLabelMap,
  getPrefixSuffixOptions,
} from './util';

describe('getPoFieldsLabelMap', () => {
  it('should return labels\' map of PO fields', () => {
    expect(getPoFieldsLabelMap()).toEqual(
      expect.objectContaining({
        'vendor': 'ui-orders.orderDetails.vendor',
        'ongoing.isSubscription': 'ui-orders.renewals.subscription',
        'workflowStatus': 'ui-orders.orderSummary.workflowStatus',
      }),
    );
  });
});

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: jest.fn(),
}));

describe('getPrefixSuffixOptions', () => {
  beforeEach(() => {
    useIntl.mockReturnValue({
      formatMessage: ({ }, { name }) => `${name} (deprecated)`,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should filter deprecated prefixes out, but the selected prefix should always be shown. Show a hint if it is deprecated', () => {
    const records = [
      {
        id: 'db9f5d17-0ca3-4d14-ae49-16b63c8fc083',
        name: 'pref',
        description: 'Prefix for test purposes',
        deprecated: false,
      },
      {
        id: 'a91e8e98-2e83-4e05-abc7-908ba801edb0',
        name: 'pref2',
        description: 'test deprecated',
        deprecated: true,
      },
      {
        id: '7daa881b-4209-44a1-8f37-2388385783b0',
        name: 'pref3',
        description: 'test deprecated',
        deprecated: false,
      },
      {
        id: '7daa881b-4209-44a1-8f37-2388385783b1',
        name: 'pref4',
        description: 'test deprecated',
        deprecated: true,
      },
    ];
    const selectedValue = 'pref2';
    const intl = useIntl();
    const actual = getPrefixSuffixOptions(
      records,
      selectedValue,
      intl,
    );
    const expected = [
      {
        label: 'pref',
        value: 'pref',
      },
      {
        label: 'pref2 (deprecated)',
        value: 'pref2',
      },
      {
        label: 'pref3',
        value: 'pref3',
      },
    ];
    expect(actual).toEqual(expected);
  });
});
