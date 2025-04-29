import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Donors,
  fundDistributionShape,
  useFunds,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../../components/POLine/const';
import { useManageDonorOrganizationIds } from '../../../../components/POLine/hooks';

const DonorInformationForm = ({ formValues, fundDistribution }) => {
  const { funds } = useFunds();
  const initialDonorOrganizationIds = get(formValues, POL_FORM_FIELDS.donorOrganizationIds, []);
  const { donorOrganizationIds, onDonorRemove, setDonorIds } = useManageDonorOrganizationIds({
    funds,
    fundDistribution,
    initialDonorOrganizationIds,
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

DonorInformationForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  fundDistribution: fundDistributionShape,
};

export default DonorInformationForm;
