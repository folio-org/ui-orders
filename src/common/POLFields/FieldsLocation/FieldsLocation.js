import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FieldLocationFinal,
  RepeatableFieldWithValidation,
  TextField,
} from '@folio/stripes-acq-components';

import {
  isLocationEresourceQuantityRequired,
  isLocationPhysicalQuantityRequired,
  isLocationsRequired,
  parseQuantity,
  validateLocation,
  validateQuantityElectronic,
  validateQuantityPhysical,
} from './validate';

const NO_VALIDATE = undefined;

const FieldsLocation = ({
  changeLocation,
  isDisabledToChangePaymentInfo,
  locationIds,
  locations,
  pOLineFormValues: { orderFormat, physical, eresource } = {},
  withValidation,
}) => {
  if (!locations) return null;

  const isPhysicalQuantityRequired = isLocationPhysicalQuantityRequired(orderFormat, physical?.createInventory);
  const isElectronicQuantityRequired = isLocationEresourceQuantityRequired(orderFormat, eresource?.createInventory);

  return (
    <FieldArray
      addLabel={isDisabledToChangePaymentInfo ? null : <FormattedMessage id="ui-orders.location.button.addLocation" />}
      component={RepeatableFieldWithValidation}
      name="locations"
      validate={withValidation ? isLocationsRequired : NO_VALIDATE}
      canAdd={!isDisabledToChangePaymentInfo}
      canRemove={!isDisabledToChangePaymentInfo}
      renderField={(field) => (
        <Row>
          <Col xs={6}>
            <FieldLocationFinal
              isDisabled={isDisabledToChangePaymentInfo}
              labelId="ui-orders.location.nameCode"
              locationsForDict={locations}
              name={`${field}.locationId`}
              onChange={changeLocation}
              prepopulatedLocationsIds={locationIds}
              required={withValidation}
              validate={withValidation ? validateLocation : NO_VALIDATE}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
              name={`${field}.quantityPhysical`}
              parse={parseQuantity}
              required={withValidation && isPhysicalQuantityRequired}
              type="number"
              validate={withValidation ? validateQuantityPhysical : NO_VALIDATE}
              isNonInteractive={isDisabledToChangePaymentInfo}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
              name={`${field}.quantityElectronic`}
              parse={parseQuantity}
              required={withValidation && isElectronicQuantityRequired}
              type="number"
              validate={withValidation ? validateQuantityElectronic : NO_VALIDATE}
              isNonInteractive={isDisabledToChangePaymentInfo}
            />
          </Col>
        </Row>
      )}
    />
  );
};

FieldsLocation.propTypes = {
  changeLocation: PropTypes.func.isRequired,
  isDisabledToChangePaymentInfo: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  pOLineFormValues: PropTypes.object,
  withValidation: PropTypes.bool,
};

FieldsLocation.defaultProps = {
  locations: [],
  isDisabledToChangePaymentInfo: false,
  withValidation: true,
};

export default FieldsLocation;
