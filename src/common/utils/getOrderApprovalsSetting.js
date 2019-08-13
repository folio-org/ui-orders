import { get } from 'lodash';
// eslint-disable-next-line import/prefer-default-export
export const getOrderApprovalsSetting = (configs) => {
  let orderApprovalsSetting = get(configs, [0, 'value'], '{}');

  try {
    orderApprovalsSetting = JSON.parse(orderApprovalsSetting);
  } catch (e) {
    orderApprovalsSetting = {};
  }

  return orderApprovalsSetting;
};
