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

import { getFieldQuantity } from '../../../common/utils';

const Location = ({ location, locationsMap, holdings, orderFormat }) => {
  const filteredLocation = locationsMap[location.locationId] || {};
  const holding = find(holdings, ['id', location.holdingId]);
  const { name, code } = filteredLocation;
  const locationNameCode = name ? `${name} (${code})` : '';
  const labelId = location.holdingId ? 'ui-orders.location.holding' : 'ui-orders.location.nameCode';
  const locationValue = location.holdingId
    ? getHoldingLocationName(holding, locationsMap)
    : locationNameCode;

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id={labelId} />}
          value={locationValue}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
          value={getFieldQuantity({ location, orderFormat }, 'location.quantityPhysical')}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
          value={getFieldQuantity({ location, orderFormat }, 'location.quantityElectronic')}
        />
      </Col>
    </Row>
  );
};

const LocationView = ({ locations = [], lineLocations = [], orderFormat }) => {
  const lineHoldingIds = lineLocations.map(({ holdingId }) => holdingId).filter(Boolean);
  const { isLoading, holdings } = useLineHoldings(lineHoldingIds);
  const locationsMap = useMemo(() => keyBy(locations, 'id'), [locations]);

  if (isLoading) return <Loading />;

  return lineLocations.map((location, i) => (
    <Location
      key={location.id || i}  // i is required when new row of Location is added by User
      location={location}
      locationsMap={locationsMap}
      holdings={holdings}
      orderFormat={orderFormat}
    />
  ));
};

Location.propTypes = {
  location: PropTypes.object,
  locationsMap: PropTypes.object,
  holdings: PropTypes.arrayOf(PropTypes.object),
  orderFormat: PropTypes.string.isRequired,
};

LocationView.propTypes = {
  lineLocations: PropTypes.arrayOf(PropTypes.object),
  locations: PropTypes.arrayOf(PropTypes.object),
  orderFormat: PropTypes.string.isRequired,
};

export default LocationView;
