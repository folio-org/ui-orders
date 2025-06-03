import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';

import { Loading } from '@folio/stripes/components';
import {
  Donors,
  fundDistributionShape,
  useFunds,
} from '@folio/stripes-acq-components';

import { useManageDonorOrganizationIds } from '../../../../components/POLine/hooks';
import { POL_FORM_FIELDS } from '../../../../common/constants';

const DonorInformationForm = ({ formValues, fundDistribution }) => {
  const initialDonorOrganizationIds = get(formValues, POL_FORM_FIELDS.donorOrganizationIds, []);

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

  if (isFundsLoading) {
    return <Loading />;
  }

  return (
    <Donors
      donorOrganizationIds={donorOrganizationIds}
      name="donorOrganizationIds"
      onChange={setDonorIds}
      onRemove={onDonorRemove}
    />
  );
};

DonorInformationForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  fundDistribution: fundDistributionShape,
};

export default DonorInformationForm;
