import React from 'react';

import {
  Donors,
  fundDistributionShape,
  useFunds,
} from '@folio/stripes-acq-components';

import { useManageDonorOrganizationIds } from '../../../../components/POLine/hooks';

const DonorInformation = ({ fundDistribution }) => {
  const { funds } = useFunds();
  const { donorOrganizationIds, onDonorRemove, setDonorIds } = useManageDonorOrganizationIds({
    funds,
    fundDistribution,
    initialDonorOrganizationIds: [],
  });

  return (
    <Donors
      donorOrganizationIds={donorOrganizationIds}
      name="donorOrganizationIds"
      onChange={setDonorIds}
      onRemove={onDonorRemove}
    />
  );
};

DonorInformation.propTypes = {
  fundDistribution: fundDistributionShape,
};

export default DonorInformation;
