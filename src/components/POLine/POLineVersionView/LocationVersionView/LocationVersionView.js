import PropTypes from 'prop-types';
import { useCallback, useContext, useMemo } from 'react';

import { KeyValue } from '@folio/stripes/components';
import {
  getHighlightedFields,
  VersionViewContext,
} from '@folio/stripes-acq-components';

import LocationView from '../../Location/LocationView';

const LOCATIONS_NAME = 'locations';

export const LocationVersionView = ({ version }) => {
  const versionContext = useContext(VersionViewContext);

  const locations = version?.locations;
  const locationsList = version?.locationsList;

  const highlights = useMemo(() => (
    getHighlightedFields({
      changes: versionContext?.changes,
      fieldNames: ['locationId', 'holdingId', 'quantityPhysical', 'quantityElectronic'],
      name: LOCATIONS_NAME,
    })
  ), [versionContext?.changes]);

  const renderKeyValueComponent = useCallback(({ name, value, ...props }) => {
    const isUpdated = highlights?.includes(name);
    const displayValue = isUpdated ? <mark>{value}</mark> : value;

    return (
      <KeyValue
        {...props}
        value={displayValue}
      />
    );
  }, [highlights]);

  return (
    <LocationView
      component={renderKeyValueComponent}
      lineLocations={locations}
      locations={locationsList}
      name={LOCATIONS_NAME}
    />
  );
};

LocationVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
