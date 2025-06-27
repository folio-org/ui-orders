import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  KeyValue,
  Loading,
} from '@folio/stripes/components';
import { useFiscalYear } from '@folio/stripes-acq-components';

import { formatOpenedFiscalYear } from '../../../common/utils';

export const FiscalYearOpenedView = ({
  fiscalYearId,
  name = 'fiscalYearId',
}) => {
  const intl = useIntl();

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
        value={formatOpenedFiscalYear(fiscalYear, intl.formatMessage({ id: 'stripes-acq-components.invalidReference' }))}
      />
    );
};
