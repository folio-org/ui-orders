import { useMemo } from 'react';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../constants';

const useCloseReasonOptions = (formatMessage, backendReasons) => {
  const translatedReasonsOptions = useMemo(
    () => backendReasons?.map(({ reason }) => {
      const reasonTranslationKey = DEFAULT_CLOSE_ORDER_REASONS[reason];
      const reasonTranslationValue = reasonTranslationKey
        ? formatMessage({
          id: `ui-orders.closeOrderModal.closingReasons.${reasonTranslationKey}`,
          defaultMessage: reason,
        })
        : reason;

      return {
        label: reasonTranslationValue,
        value: reason,
      };
    }),
    [backendReasons, formatMessage],
  );

  return translatedReasonsOptions;
};

export default useCloseReasonOptions;
