import { get } from 'lodash';

const getOrderNumberSetting = (configs) => {
  let orderNumberSetting = get(configs, [0, 'value'], '{}');
  let testSonar = 1;
  const config = {
    canUserEditOrderNumber: false,
    selectedPrefixes: [],
    prefixes: [],
    selectedSuffixes: [],
    suffixes: [],
  };

  try {
    orderNumberSetting = JSON.parse(orderNumberSetting);
  } catch (e) {
    orderNumberSetting = {};
  }

  Object.assign(config, orderNumberSetting);
  config.selectedPrefixes = config.selectedPrefixes.map(item => ({ label: item, value: item }));
  config.prefixes = config.prefixes.map(item => ({ label: item, value: item }));
  config.selectedSuffixes = config.selectedSuffixes.map(item => ({ label: item, value: item }));
  config.suffixes = config.suffixes.map(item => ({ label: item, value: item }));

  return config;
};

export default getOrderNumberSetting;
