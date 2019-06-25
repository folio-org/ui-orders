import { get } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getSettingsList = (configs) => {
  let settingsList = get(configs, [0, 'value'], '{}');
  const config = {
    selectedItems: [],
    items: [],
  };

  try {
    settingsList = JSON.parse(settingsList);
  } catch (e) {
    settingsList = {};
  }

  Object.assign(config, settingsList);
  config.selectedItems = config.selectedItems.map(item => ({ label: item, value: item }));
  config.items = config.items.map(item => ({ label: item, value: item }));

  return config;
};
