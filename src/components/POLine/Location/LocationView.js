import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { filter, get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const Location = ({ location, locations }) => {
  const filteredLocation = filter(locations, { id: location.locationId });
  const { name, code } = get(filteredLocation, '0', {});

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.location.nameCode" />}
          value={`${name} (${code})`}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
          value={location.quantityPhysical}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
          value={location.quantityElectronic}
        />
      </Col>
    </Row>
  );
};

const LocationView = ({ locations = {}, lineLocations = [] }) => {
  return lineLocations.map((location, i) => (
    <Location
      key={location.id || i}  // i is required when new row of Location is added by User
      location={location}
      locations={locations}
    />
  ));
};

Location.propTypes = {
  location: PropTypes.object,
  locations: PropTypes.arrayOf(PropTypes.object),
};

LocationView.propTypes = {
  lineLocations: PropTypes.arrayOf(PropTypes.object),
  locations: PropTypes.arrayOf(PropTypes.object),
};

export default LocationView;
