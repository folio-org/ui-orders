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
  useCentralOrderingContext,
  useConsortiumTenants,
} from '@folio/stripes-acq-components';

import { useLocationsAndHoldingsByTenants } from '../../../common/hooks';

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
  const holding = find(holdings, ['id', location.holdingId]);

  const { name, code } = filteredLocation;
  const locationNameCode = name ? `${name} (${code})` : '';
  const labelId = location.holdingId ? 'ui-orders.location.holding' : 'ui-orders.location.nameCode';
  const locationValue = location.holdingId
    ? getHoldingLocationName(holding, locationsMap)
    : locationNameCode;
  const locationName = getLocationFieldName(fieldName, location.holdingId);
  const affiliationValue = affiliationsMap?.[location.tenantId]?.name || <FormattedMessage id="stripes-acq-components.invalidReference" />;

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
  lineLocations = [],
  name,
  ...props
}) => {
  const { isCentralOrderingEnabled } = useCentralOrderingContext();
  const { tenants: consortiumTenants } = useConsortiumTenants();
  const affiliationsMap = useMemo(() => keyBy(consortiumTenants, 'id'), [consortiumTenants]);
  const receivingTenantIds = useMemo(() => {
    return lineLocations.map(({ tenantId }) => tenantId).filter(Boolean);
  }, [lineLocations]);

  const {
    locations,
    isLoading,
    holdings,
  } = useLocationsAndHoldingsByTenants({
    tenantIds: receivingTenantIds,
    instanceId,
  });

  const locationsMap = useMemo(() => keyBy(locations, 'id'), [locations]);

  if (isLoading) return <Loading />;

  return (
    <>
      {
        lineLocations.map((location, i) => {
          const { holdingId, locationId } = location;

          return (
            <Location
              key={holdingId || locationId || i}  // i is required when new row of Location is added by User
              centralOrdering={isCentralOrderingEnabled}
              affiliationsMap={affiliationsMap}
              location={location}
              locationsMap={locationsMap}
              holdings={holdings}
              name={name && `${name}[${i}]`}
              {...props}
            />
          );
        })
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
