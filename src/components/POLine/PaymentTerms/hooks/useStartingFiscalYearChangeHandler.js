import { useForm } from 'react-final-form';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import { fetchPaymentTermsFiscalYears } from '../fetchPaymentTermsFiscalYears';

export const useStartingFiscalYearChangeHandler = () => {
  const ky = useOkapiKy();
  const { change } = useForm();

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (value) => {
      change(`${POL_FORM_FIELDS.paymentTerms}.prepaymentTerm`, undefined);
      change(`${POL_FORM_FIELDS.paymentTerms}.fiscalYearDistributions`, undefined);
      change(`${POL_FORM_FIELDS.paymentTerms}.startingFiscalYearId`, value);

      if (!value) {
        return Promise.resolve({ fiscalYears: [] });
      }

      return fetchPaymentTermsFiscalYears(ky)(value)
        .then((data) => {
          const terms = data.fiscalYears
            ?.slice(0, 2)
            ?.map((fy) => ({ fiscalYearId: fy.id, fundDistributions: [] }));

          change(`${POL_FORM_FIELDS.paymentTerms}.prepaymentTerm`, terms.length);
          change(`${POL_FORM_FIELDS.paymentTerms}.fiscalYearDistributions`, terms);

          return data;
        });
    },
  });

  return {
    handleChange: mutateAsync,
    isLoading,
  };
};
