import { getDonorUrl } from './utils';

describe('getDonorUrl', () => {
  it('should return donor url', () => {
    expect(getDonorUrl('1')).toBe('/organizations/view/1');
  });

  it('should return undefined', () => {
    expect(getDonorUrl()).toBe(undefined);
  });
});
