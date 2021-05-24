import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import { FieldsLocation } from '../../../../common/POLFields';

const POLineLocationsForm = ({ locations, locationIds, changeLocation }) => {
  const { values } = useFormState();
  const pOLineFormValues = { instanceId: values.instanceId };

  return (
    <Row start="xs">
      <Col xs={12}>
        <FieldsLocation
          changeLocation={changeLocation}
          locationIds={locationIds}
          locations={locations}
          withValidation={false}
          pOLineFormValues={pOLineFormValues}
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
