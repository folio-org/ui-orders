import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import {
  useEffect,
  useMemo,
} from 'react';
import {
  useForm,
  useFormState,
} from 'react-final-form';

import { Loading } from '@folio/stripes/components';
import {
  Donors,
  useFunds,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import { useManageDonorOrganizationIds } from '../../../../components/POLine/hooks';

const DonorInformationForm = () => {
  const { change } = useForm();
  const { values, initialValues } = useFormState();

  const initialDonorOrganizationIds = get(initialValues, POL_FORM_FIELDS.donorOrganizationIds, []);
  const fundDistribution = get(values, POL_FORM_FIELDS.fundDistribution, []);

  const {
    funds,
    isLoading: isFundsLoading,
  } = useFunds();

  const {
    donorOrganizationIds,
    onDonorRemove,
    setDonorIds,
  } = useManageDonorOrganizationIds({
    funds,
    fundDistribution,
    initialDonorOrganizationIds,
  });

  const shouldUpdateDonorOrganizationIds = useMemo(() => {
    const hasChanged = !isEqual(donorOrganizationIds, values?.donorOrganizationIds);
    const isFundDistributionChanged = !isEqual(fundDistribution, initialValues?.fundDistribution);

    return hasChanged && isFundDistributionChanged;
  }, [
    donorOrganizationIds,
    fundDistribution,
    initialValues?.fundDistribution,
    values?.donorOrganizationIds,
  ]);

  useEffect(() => {
    if (shouldUpdateDonorOrganizationIds) {
      change(POL_FORM_FIELDS.donorOrganizationIds, donorOrganizationIds);
    }
  }, [change, donorOrganizationIds, shouldUpdateDonorOrganizationIds]);

  if (isFundsLoading) {
    return <Loading />;
  }

  return (
    <Donors
      donorOrganizationIds={donorOrganizationIds}
      name={POL_FORM_FIELDS.donorOrganizationIds}
      onChange={setDonorIds}
      onRemove={onDonorRemove}
    />
  );
};

export default DonorInformationForm;
