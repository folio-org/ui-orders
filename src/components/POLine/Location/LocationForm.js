import React from 'react';
import PropTypes from 'prop-types';

import {
  ifDisabledToChangePaymentInfo,
  isWorkflowStatusIsPending,
} from '../../PurchaseOrder/util';
import { FieldsLocation } from '../../../common/POLFields';

const LocationForm = ({
  changeLocation,
  formValues,
  isPackage,
  locationIds,
  locations,
  order,
}) => {
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);

  return (
    <FieldsLocation
      changeLocation={changeLocation}
      isDisabledToChangePaymentInfo={isDisabledToChangePaymentInfo}
      isPostPendingOrder={isPostPendingOrder}
      locationIds={locationIds}
      locations={locations}
      pOLineFormValues={formValues}
      withValidation={!isPackage}
    />
  );
};

LocationForm.propTypes = {
  changeLocation: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
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
