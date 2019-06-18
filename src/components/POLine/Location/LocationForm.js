import React from 'react';
import {
  Field,
  FieldArray,
} from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Select,
  TextField,
} from '@folio/stripes/components';

import { isWorkflowStatusOpen } from '../../PurchaseOrder/util';
import getLocationsForSelect from '../../Utils/getLocationsForSelect';
import { required } from '../../Utils/Validate';
import { RepeatableFieldWithErrorMessage } from '../../../common/RepeatableFieldWithErrorMessage/RepeatableFieldWithErrorMessage';
import {
  isLocationsRequired,
  parseQuantity,
  validateLocation,
  validateNotNegative, validateQuantityElectronic,
  validateQuantityPhysical,
} from './validate';

const LocationForm = ({ order, parentResources }) => {
  const isOpenedOrder = isWorkflowStatusOpen(order);

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-orders.location.button.addLocation" />}
      component={RepeatableFieldWithErrorMessage}
      name="locations"
      validate={isLocationsRequired}
      props={{
        canAdd: !isOpenedOrder,
        canRemove: !isOpenedOrder,
      }}
      renderField={(field) => (
        <React.Fragment>
          <Col xs={6}>
            <Field
              component={Select}
              dataOptions={getLocationsForSelect(parentResources)}
              fullWidth
              label={<FormattedMessage id="ui-orders.location.nameCode" />}
              name={`${field}.locationId`}
              placeholder=" "
              required
              validate={[required, validateLocation]}
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
              name={`${field}.quantityPhysical`}
              parse={parseQuantity}
              type="number"
              validate={[validateNotNegative, validateQuantityPhysical]}
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
              name={`${field}.quantityElectronic`}
              parse={parseQuantity}
              type="number"
              validate={[validateNotNegative, validateQuantityElectronic]}
              disabled={isOpenedOrder}
            />
          </Col>
        </React.Fragment>
      )}
    />
  );
};

LocationForm.propTypes = {
  parentResources: PropTypes.object,
  order: PropTypes.object.isRequired,
};

export default LocationForm;
