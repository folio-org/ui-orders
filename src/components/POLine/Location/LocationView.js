import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find, keyBy } from 'lodash';

import {
  Col,
  KeyValue,
  Loading,
  Row,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  useLineHoldings,
} from '@folio/stripes-acq-components';

const getLocationFieldName = (fieldName, holdingId) => {
  if (fieldName) {
    return holdingId
      ? `${fieldName}.holdingId`
      : `${fieldName}.locationId`;
  }

  return undefined;
};

const Location = ({
  centralOrdering,
  component,
  holdings,
  location,
  locationsMap,
  name: fieldName,
}) => {
  const filteredLocation = locationsMap[location.locationId] || {};
  const holding = find(holdings, ['id', location.holdingId]);
  const { name, code } = filteredLocation;
  const locationNameCode = name ? `${name} (${code})` : '';
  const labelId = location.holdingId ? 'ui-orders.location.holding' : 'ui-orders.location.nameCode';
  const locationValue = location.holdingId
    ? getHoldingLocationName(holding, locationsMap)
    : locationNameCode;
  const locationName = getLocationFieldName(fieldName, location.holdingId);

  const KeyValueComponent = component || KeyValue;

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValueComponent
          name={locationName}
          label={<FormattedMessage id={labelId} />}
          value={locationValue}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValueComponent
          name={fieldName && `${fieldName}.quantityPhysical`}
          label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
          value={location.quantityPhysical}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValueComponent
          name={fieldName && `${fieldName}.quantityElectronic`}
          label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
          value={location.quantityElectronic}
        />
      </Col>
    </Row>
  );
};

const LocationView = ({
  locations = [],
  lineLocations = [],
  name,
  ...props
}) => {
  const lineHoldingIds = lineLocations.map(({ holdingId }) => holdingId).filter(Boolean);
  const { isLoading, holdings } = useLineHoldings(lineHoldingIds);
  const locationsMap = useMemo(() => keyBy(locations, 'id'), [locations]);

  if (isLoading) return <Loading />;

  return (
    <>
      {
        lineLocations.map((location, i) => (
          <Location
            key={location.id || i}  // i is required when new row of Location is added by User
            location={location}
            locationsMap={locationsMap}
            holdings={holdings}
            name={name && `${name}[${i}]`}
            {...props}
          />
        ))
      }
    </>
  );
};

Location.propTypes = {
  centralOrdering: PropTypes.bool,
  component: PropTypes.node,
  location: PropTypes.object,
  locationsMap: PropTypes.object,
  holdings: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
};

LocationView.propTypes = {
  centralOrdering: PropTypes.bool,
  lineLocations: PropTypes.arrayOf(PropTypes.object),
  locations: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
};

export default LocationView;
