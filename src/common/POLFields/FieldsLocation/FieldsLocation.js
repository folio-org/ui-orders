import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  FieldArray,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldLocation,
  validateRequired,
} from '@folio/stripes-acq-components';

import { RepeatableFieldWithErrorMessage } from '../../RepeatableFieldWithErrorMessage/RepeatableFieldWithErrorMessage';
import {
  isLocationsRequired,
  parseQuantity,
  validateLocation,
  validateNotNegative,
  validateQuantityElectronic,
  validateQuantityPhysical,
} from './validate';

const NO_VALIDATE = [];

const FieldsLocation = ({
  changeLocation,
  disabled,
  isDisabledToChangePaymentInfo,
  locationIds,
  locations,
  withValidation,
}) => {
  const onChangeLocation = useCallback((name, id) => changeLocation(name, id), [changeLocation]);

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-orders.location.button.addLocation" />}
      component={RepeatableFieldWithErrorMessage}
      name="locations"
      validate={withValidation ? isLocationsRequired : NO_VALIDATE}
      props={{
        canAdd: !isDisabledToChangePaymentInfo,
        canRemove: !isDisabledToChangePaymentInfo,
      }}
      renderField={(field) => (
        <Row>
          <Col xs={6}>
            <FieldLocation
              isDisabled={disabled}
              labelId="ui-orders.location.nameCode"
              locationsForDict={locations}
              name={`${field}.locationId`}
              onChange={({ id }) => onChangeLocation(`${field}.locationId`, id)}
              prepopulatedLocationsIds={locationIds}
              required={withValidation}
              validate={withValidation ? [validateRequired, validateLocation] : NO_VALIDATE}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
              name={`${field}.quantityPhysical`}
              parse={parseQuantity}
              type="number"
              validate={withValidation ? [validateNotNegative, validateQuantityPhysical] : NO_VALIDATE}
              disabled={isDisabledToChangePaymentInfo}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
              name={`${field}.quantityElectronic`}
              parse={parseQuantity}
              type="number"
              validate={withValidation ? [validateNotNegative, validateQuantityElectronic] : NO_VALIDATE}
              disabled={isDisabledToChangePaymentInfo}
            />
          </Col>
        </Row>
      )}
    />
  );
};

FieldsLocation.propTypes = {
  changeLocation: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isDisabledToChangePaymentInfo: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  withValidation: PropTypes.bool,
};

FieldsLocation.defaultProps = {
  locations: [],
  disabled: false,
  isDisabledToChangePaymentInfo: false,
  withValidation: true,
};

export default FieldsLocation;
