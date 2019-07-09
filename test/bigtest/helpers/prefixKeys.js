// mimics the StripesTranslationPlugin in @folio/stripes-core
// eslint-disable-next-line import/prefer-default-export
export const prefixKeys = (obj, translationPrefix) => {
  const res = {};

  for (const key of Object.keys(obj)) {
    res[`${translationPrefix}.${key}`] = obj[key];
  }

  return res;
};
