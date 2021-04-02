import {
  escape,
} from 'lodash';

export const escapeValue = (val) => {
  if (val.startsWith('<Barcode>') && val.endsWith('</Barcode>')) {
    return val;
  }

  return escape(val);
};

export function buildTemplate(template = '') {
  return dataSource => {
    return template.replace(/{{([^{}]*)}}/g, (token, tokenName) => {
      const tokenValue = dataSource?.[tokenName];

      return typeof tokenValue === 'string' || typeof tokenValue === 'number' ? escapeValue(tokenValue) : '';
    });
  };
}
