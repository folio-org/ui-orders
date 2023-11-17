import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useManageDonorOrganizationIds } from './useManageDonorOrganizationIds';

const defaultProps = {
  funds: [{
    code: 'STATE-SUBN',
    encumbrance: 'eb506834-6c70-4239-8d1a-6414a5b08011',
    fundId: 'fundId',
    distributionType: 'percentage',
    value: 100,
    id: 'fundId',
    donorOrganizationIds: ['donorId'],
  }],
  fundDistribution: [
    {
      id: 'fundId',
      fundId: 'fundId',
      code: 'STATE-SUBN',
      name: 'STATE-SUBN',
    },
  ],
  initialDonorOrganizationIds: [],
};

describe('useManageDonorOrganizationIds', () => {
  it('should return setDonorIds, onDonorRemove and donorOrganizationIds', () => {
    const { result } = renderHook(() => useManageDonorOrganizationIds(defaultProps));

    expect(result.current).toEqual(expect.objectContaining({
      donorOrganizationIds: ['donorId'],
      onDonorRemove: expect.any(Function),
      setDonorIds: expect.any(Function),
    }));
  });

  it('should return list of donorOrganizationIds with [fundId, donorId]', () => {
    const { result } = renderHook(() => useManageDonorOrganizationIds({
      ...defaultProps,
      initialDonorOrganizationIds: ['fundId'],
    }));

    expect(result.current).toEqual(expect.objectContaining({
      donorOrganizationIds: ['fundId', 'donorId'],
      onDonorRemove: expect.any(Function),
      setDonorIds: expect.any(Function),
    }));
  });
});
