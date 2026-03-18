import invert from 'lodash/invert';
import { FormattedMessage } from 'react-intl';

export const buildCommonTranslatedDictionary = (dictionary, baseTranslationKey) => {
  return Object.fromEntries(
    Object.entries(invert(dictionary))
      .map(([orderType, key]) => [orderType, <FormattedMessage key={key} id={`${baseTranslationKey}${key}`} />]),
  );
};
