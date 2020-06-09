import React from 'react';
import PropTypes from 'prop-types';

import { ifDisabledToChangePaymentInfo, isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import { FieldsLocation } from '../../../common/POLFields';

const LocationForm = ({
  changeLocation,
  isPackage,
  locationIds,
  locations,
  order,
}) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);

  return (
    <FieldsLocation
      changeLocation={changeLocation}
      disabled={isPostPendingOrder}
      isDisabledToChangePaymentInfo={isDisabledToChangePaymentInfo}
      locationIds={locationIds}
      locations={locations}
      withValidation={!isPackage}
    />
  );
};

LocationForm.propTypes = {
  changeLocation: PropTypes.func.isRequired,
  isPackage: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
};

LocationForm.defaultProps = {
  locations: [],
  isPackage: false,
};

export default LocationForm;
