import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { Loading } from '@folio/stripes/components';

import { usePaymentTermsFiscalYears } from '../../PaymentTerms/hooks';
import { PaymentTermsVersionViewContent } from './PaymentTermsVersionViewContent';

export const PaymentTermsVersionView = ({ version }) => {
  const currency = version?.cost?.currency;
  const paymentTerms = version?.paymentTerms;
  const startingFiscalYearId = paymentTerms?.startingFiscalYearId;

  const {
    fiscalYears,
    isFetching,
  } = usePaymentTermsFiscalYears(startingFiscalYearId);

  const fiscalYearsMap = useMemo(() => new Map(fiscalYears.map((fy) => [fy.id, fy])), [fiscalYears]);

  if (isFetching) return <Loading />;

  return (
    <PaymentTermsVersionViewContent
      currency={currency}
      fiscalYearsMap={fiscalYearsMap}
      paymentTerms={paymentTerms}
    />
  );
};

PaymentTermsVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
