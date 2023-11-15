import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useGetDonorsByFundId } from './useGetDonorsByFundId';

const defaultProps = {
  funds: [{
    'code': 'STATE-SUBN',
    'encumbrance': 'eb506834-6c70-4239-8d1a-6414a5b08011',
    'fundId': 'fundId',
    'distributionType': 'percentage',
    'value': 100,
  }],
  fundDistribution: [
    {
      'id': 'fundId',
      'code': 'STATE-SUBN',
      'name': 'STATE-SUBN',
      'donorOrganizationIds': [
        '80fb5168-cdf1-11e8-a8d5-c2801f1b9f21',
      ],
    },
  ],
  initialDonorOrganizationIds: [],
};

describe('useGetDonorsByFundId', () => {
  it('should return close reason options from default list', () => {
    const { result } = renderHook(() => useGetDonorsByFundId(defaultProps));

    expect(result.current).toEqual(expect.objectContaining({
      donorOrganizationIds: [],
      onDonorRemove: expect.any(Function),
      setDonorIds: expect.any(Function),
    }));
  });
});
