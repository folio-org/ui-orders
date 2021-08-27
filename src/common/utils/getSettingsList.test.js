import { getSettingsList } from './getSettingsList';

const NAME = 'name';

const configsMock = [
  {
    value: JSON.stringify({ name: NAME }),
  },
  { value: {} },
];

describe('getSettingsList', () => {
  it('should return settings list', () => {
    expect(getSettingsList(configsMock)).toEqual([{
      label: NAME,
      value: NAME,
    }]);
  });

  it('should return empty list if there is no config', () => {
    expect(getSettingsList()).toEqual([]);
  });
});
