import getCreateInventorySetting from './getCreateInventorySetting';

const settingsMock = {
  eresource: 'Instance, Holding',
  physical: 'Instance, Holding, Item',
  other: 'None',
};

describe('getCreateInventorySetting', () => {
  it('should return settings object', () => {
    expect(getCreateInventorySetting()).toEqual(settingsMock);
  });
});
