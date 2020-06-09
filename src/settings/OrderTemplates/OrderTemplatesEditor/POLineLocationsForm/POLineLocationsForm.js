import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import { FieldsLocation } from '../../../../common/POLFields';

const POLineLocationsForm = ({ locations, locationIds, changeLocation }) => {
  return (
    <Row start="xs">
      <Col xs={12}>
        <FieldsLocation
          changeLocation={changeLocation}
          locationIds={locationIds}
          locations={locations}
          withValidation={false}
        />
      </Col>
    </Row>
  );
};

POLineLocationsForm.propTypes = {
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  changeLocation: PropTypes.func.isRequired,
};

export default POLineLocationsForm;
