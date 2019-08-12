import { get } from 'lodash';

const getOrderNumberSetting = (configs) => {
  let orderApprovalsSetting = get(configs, [0, 'value'], '{}');
  const config = {
    isApprovalRequired: false,
  };

  try {
    orderApprovalsSetting = JSON.parse(orderApprovalsSetting);
  } catch (e) {
    orderApprovalsSetting = {};
  }

  Object.assign(config, orderApprovalsSetting);

  return config;
};

export default getOrderNumberSetting;
