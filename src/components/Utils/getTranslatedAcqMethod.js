import { invert } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { ACQUISITION_METHOD } from '@folio/stripes-acq-components';

export const getTranslatedAcqMethod = (value = '') => {
  const acqMethodsMap = invert(ACQUISITION_METHOD);
  const acqMethodTranslationKey = acqMethodsMap[value];

  return acqMethodTranslationKey
    ? (
      <FormattedMessage
        id={`stripes-acq-components.acquisition_method.${acqMethodTranslationKey}`}
        defaultMessage={value}
      />
    )
    : value;
};
