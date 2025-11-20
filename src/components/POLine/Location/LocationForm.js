import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { FieldsLocation } from '../../../common/POLFields';
import {
  ifDisabledToChangePaymentInfo,
  isWorkflowStatusIsPending,
  isWorkflowStatusOpen,
} from '../../PurchaseOrder/util';
import { usePOLinePiecesExistence } from '../hooks';
import { isSynchronizedReceivingWorkflow } from '../utils';

const DEFAULT_LOCATIONS = [];

const LocationForm = ({
  centralOrdering,
  changeLocation,
  filterHoldings,
  filterLocations,
  formValues,
  isLoading = false,
  locationIds,
  locations = DEFAULT_LOCATIONS,
  order,
}) => {
  const isPendingOrder = isWorkflowStatusIsPending(order);
  const isPostPendingOrder = !isPendingOrder;
  const isSynchronized = isSynchronizedReceivingWorkflow(formValues);
  const shouldCheckReceivedPiecesExistence = isSynchronized && isPendingOrder;

  // Check if there are received pieces for the PO Line of pending Order
  const {
    isExist: isReceivedPiecesExist,
    isFetching: isReceivedPiecesExistFetching,
  } = usePOLinePiecesExistence(
    formValues.id,
    {
      enabled: shouldCheckReceivedPiecesExistence,
      receivingStatus: PIECE_STATUS.received,
    },
  );

  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
  const isQuantityDisabled = (
    (!(formValues.checkinItems || formValues.isPackage) && isWorkflowStatusOpen(order)) // PO Line with "Independent" receiving workflow or package in the "Open" status
    || (shouldCheckReceivedPiecesExistence && isReceivedPiecesExist) // PO Line with "Synchronized" receiving workflow and received pieces exist in the "Pending" status
  );

  if (isLoading || isReceivedPiecesExistFetching) return <Loading />;

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
  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  formValues: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
};

export default LocationForm;
