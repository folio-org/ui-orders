import React from 'react';
import PropTypes from 'prop-types';

import {
  ifDisabledToChangePaymentInfo,
  isWorkflowStatusIsPending,
  isWorkflowStatusOpen,
} from '../../PurchaseOrder/util';
import { FieldsLocation } from '../../../common/POLFields';

const LocationForm = ({
  changeLocation,
  formValues,
  locationIds,
  locations,
  order,
}) => {
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isQuantityDisabled = !(formValues.checkinItems || formValues.isPackage) && isWorkflowStatusOpen(order);

  return (
    <FieldsLocation
      changeLocation={changeLocation}
      isDisabledToChangePaymentInfo={isDisabledToChangePaymentInfo}
      isPostPendingOrder={isPostPendingOrder}
      isQuantityDisabled={isQuantityDisabled}
      locationIds={locationIds}
      locations={locations}
      pOLineFormValues={formValues}
      poNumber={order.poNumber}
      withValidation={!formValues.isPackage}
    />
  );
};

LocationForm.propTypes = {
  changeLocation: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
};

LocationForm.defaultProps = {
  locations: [],
};

export default LocationForm;
