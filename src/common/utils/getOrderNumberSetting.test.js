import getOrderNumberSetting from './getOrderNumberSetting';

const settingsMock = { canUserEditOrderNumber: false };

it('\'getOrderNumberSetting\' should return order number settings object', () => {
  expect(getOrderNumberSetting()).toEqual(settingsMock);
});
