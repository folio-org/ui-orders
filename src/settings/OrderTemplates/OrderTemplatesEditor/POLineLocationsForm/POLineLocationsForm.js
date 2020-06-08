import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import { FieldsLocation } from '../../../../common/POLFields';

const POLineLocationsForm = ({ locations, locationIds, change, dispatch }) => {
  return (
    <Row start="xs">
      <Col xs={12}>
        <FieldsLocation
          change={change}
          dispatch={dispatch}
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
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default POLineLocationsForm;
