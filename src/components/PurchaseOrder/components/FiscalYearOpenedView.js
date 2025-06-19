import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';
import { useFiscalYear } from '@folio/stripes-acq-components';

const formatFiscalYear = (fiscalYear) => {
  return fiscalYear
    ? `${fiscalYear.name} (${fiscalYear.code})`
    : '-';
};

export const FiscalYearOpenedView = ({
  fiscalYearId,
  name = 'fiscalYearId',
}) => {
  const {
    fiscalYear,
    isLoading: isFiscalYearLoading,
  } = useFiscalYear(fiscalYearId);

  return isFiscalYearLoading
    ? <Loading />
    : (
      <KeyValue
        name={name}
        label={<FormattedMessage id="ui-orders.orderDetails.yearOpened" />}
        value={formatFiscalYear(fiscalYear)}
      />
    );
};
