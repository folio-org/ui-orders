import { FormattedMessage } from 'react-intl';
import { invert } from 'lodash';

import { ACQUISITION_METHOD } from '@folio/stripes-acq-components';

const acqMethodMap = invert(ACQUISITION_METHOD);

export const getAcqMethodsOptions = (records = []) => (
  records.map(({ id, value }) => ({
    label: acqMethodMap[value]
      ? (
        <FormattedMessage
          id={`ui-orders.acquisition_method.${acqMethodMap[value]}`}
          defaultMessage={value}
        />
      )
      : value,
    value: id,
  }))
);
