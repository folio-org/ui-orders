import React from 'react';
import {
  Field,
  FieldArray,
} from 'redux-form';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

import {
  Col,
  RepeatableField,
  Select,
  TextField,
} from '@folio/stripes/components';

import getLocationsForSelect from '../../Utils/getLocationsForSelect';
import { required } from '../../Utils/Validate';
import {
  OTHER,
  PHRESOURCES,
} from '../const';
import {
  validateQuantityElectronic,
  validateQuantityPhysical,
  validateRequiredNotNegative,
} from '../../Utils/formFieldsValidators';

const parseQuantity = (value) => {
  return value ? Number(value) : 0;
};

const LocationForm = ({ parentResources, orderFormat }) => {
  const isPhysicalQuantityRequired = [...PHRESOURCES, OTHER].includes(orderFormat);

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-orders.location.button.addLocation" />}
      component={RepeatableField}
      name="locations"
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
              validate={required}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
              name={`${field}.quantityPhysical`}
              parse={parseQuantity}
              type="number"
              validate={[
                validateQuantityPhysical,
                (isPhysicalQuantityRequired
                  ? validateRequiredNotNegative
                  : noop)]}
              required={isPhysicalQuantityRequired}
            />
          </Col>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
              name={`${field}.quantityElectronic`}
              parse={parseQuantity}
              type="number"
              validate={validateQuantityElectronic}
            />
          </Col>
        </React.Fragment>
      )}
    />
  );
};

LocationForm.propTypes = {
  parentResources: PropTypes.object.isRequired,
  orderFormat: PropTypes.string.isRequired,
};

export default LocationForm;
