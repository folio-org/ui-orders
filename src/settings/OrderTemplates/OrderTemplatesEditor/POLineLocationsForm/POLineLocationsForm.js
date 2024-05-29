import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import { FieldsLocation } from '../../../../common/POLFields';

const POLineLocationsForm = ({
  centralOrdering,
  changeLocation,
  formValues,
  locations,
  locationIds,
}) => {
  return (
    <Row start="xs">
      <Col xs={12}>
        <FieldsLocation
          centralOrdering={centralOrdering}
          changeLocation={changeLocation}
          locationIds={locationIds}
          locations={locations}
          withValidation={false}
          pOLineFormValues={formValues}
        />
      </Col>
    </Row>
  );
};

POLineLocationsForm.propTypes = {
  centralOrdering: PropTypes.bool,
  changeLocation: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
};

export default POLineLocationsForm;
