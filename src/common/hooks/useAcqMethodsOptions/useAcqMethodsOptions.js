import { useIntl } from 'react-intl';
import { invert } from 'lodash';

import { ACQUISITION_METHOD } from '@folio/stripes-acq-components';

const acqMethodMap = invert(ACQUISITION_METHOD);

export const useAcqMethodsOptions = (records = []) => {
  const { formatMessage } = useIntl();

  return (
    records.map(({ id, value }) => ({
      label: acqMethodMap[value]
        ? (
          formatMessage({
            id: `ui-orders.acquisition_method.${acqMethodMap[value]}`,
            defaultMessage: value,
          })
        )
        : value,
      value: id,
    }))
  );
};
