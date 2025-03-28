import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Loading,
  Row,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  useCentralOrderingContext,
  useConsortiumTenants,
  useInstanceHoldingsQuery,
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
  affiliationsMap,
  centralOrdering = false,
  component,
  holdings,
  location,
  locationsMap,
  name: fieldName,
}) => {
  const filteredLocation = locationsMap[location.locationId] || {};
  const holding = find(
    holdings,
    {
      id: location.holdingId,
      ...(centralOrdering ? { tenantId: location.tenantId } : {}),
    },
  );

  const { name, code } = filteredLocation;
  const locationNameCode = name ? `${name} (${code})` : '';
  const labelId = location.holdingId ? 'ui-orders.location.holding' : 'ui-orders.location.nameCode';
  const locationValue = location.holdingId
    ? getHoldingLocationName(holding, locationsMap)
    : locationNameCode;
  const locationName = getLocationFieldName(fieldName, location.holdingId);
  const affiliationValue = location.tenantId && (
    affiliationsMap?.[location.tenantId]?.name || <FormattedMessage id="stripes-acq-components.invalidReference" />
  );

  const KeyValueComponent = component || KeyValue;

  return (
    <Row start="xs">
      {centralOrdering && (
        <Col
          xs={6}
          lg={3}
        >
          <KeyValueComponent
            name={fieldName && `${fieldName}.tenantId`}
            label={<FormattedMessage id="stripes-acq-components.consortia.affiliations.select.label" />}
            value={affiliationValue}
          />
        </Col>
      )}

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
  instanceId,
  locations = [],
  lineLocations = [],
  name,
  ...props
}) => {
  const { isCentralOrderingEnabled } = useCentralOrderingContext();
  const { tenants: consortiumTenants } = useConsortiumTenants();
  const { isLoading, holdings } = useInstanceHoldingsQuery(instanceId, { consortium: isCentralOrderingEnabled });
  const affiliationsMap = useMemo(() => keyBy(consortiumTenants, 'id'), [consortiumTenants]);
  const locationsMap = useMemo(() => keyBy(locations, 'id'), [locations]);

  if (isLoading) return <Loading />;

  return (
    <>
      {
        lineLocations.map((location, i) => (
          <Location
            key={location.id || i}  // i is required when new row of Location is added by User
            centralOrdering={isCentralOrderingEnabled}
            affiliationsMap={affiliationsMap}
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
  affiliationsMap: PropTypes.object,
  centralOrdering: PropTypes.bool,
  component: PropTypes.node,
  location: PropTypes.object,
  locationsMap: PropTypes.object,
  holdings: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
};

LocationView.propTypes = {
  instanceId: PropTypes.string,
  lineLocations: PropTypes.arrayOf(PropTypes.object),
  locations: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
};

export default LocationView;
