import PropTypes from 'prop-types';

import { FieldsLocation } from '../../../common/POLFields';
import {
  ifDisabledToChangePaymentInfo,
  isWorkflowStatusIsPending,
  isWorkflowStatusOpen,
} from '../../PurchaseOrder/util';

const LocationForm = ({
  centralOrdering,
  changeLocation,
  filterHoldings,
  filterLocations,
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
      centralOrdering={centralOrdering}
      changeLocation={changeLocation}
      isDisabledToChangePaymentInfo={isDisabledToChangePaymentInfo}
      isPostPendingOrder={isPostPendingOrder}
      isQuantityDisabled={isQuantityDisabled}
      locationIds={locationIds}
      locations={locations}
      pOLineFormValues={formValues}
      poNumber={order.poNumber}
      withValidation={!formValues.isPackage}
      filterHoldings={filterHoldings}
      filterLocations={filterLocations}
    />
  );
};

LocationForm.propTypes = {
  centralOrdering: PropTypes.bool,
  changeLocation: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
};

LocationForm.defaultProps = {
  locations: [],
};

export default LocationForm;
