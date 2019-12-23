import React from 'react';
import PropTypes from 'prop-types';

import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import { FieldsLocation } from '../../../common/POLFields';

const LocationForm = ({ order, locations, isPackage }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);

  return (
    <FieldsLocation
      locations={locations}
      disabled={isPostPendingOrder}
      withValidation={!isPackage}
    />
  );
};

LocationForm.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
  isPackage: PropTypes.bool,
};

LocationForm.defaultProps = {
  locations: [],
  isPackage: false,
};

export default LocationForm;
