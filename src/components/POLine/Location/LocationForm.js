import React from 'react';
import PropTypes from 'prop-types';

import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import getLocationsForSelect from '../../Utils/getLocationsForSelect';
import { FieldsLocation } from '../../../common/POLFields';

const LocationForm = ({ order, parentResources }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);

  return (
    <FieldsLocation
      locations={getLocationsForSelect(parentResources)}
      disabled={isPostPendingOrder}
    />
  );
};

LocationForm.propTypes = {
  parentResources: PropTypes.object,
  order: PropTypes.object.isRequired,
};

export default LocationForm;
