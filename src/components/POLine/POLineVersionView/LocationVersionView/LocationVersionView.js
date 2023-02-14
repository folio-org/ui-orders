import PropTypes from 'prop-types';
import { useCallback, useContext } from 'react';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import {
  VersionViewContext,
} from '@folio/stripes-acq-components';

import LocationView from '../../Location/LocationView';

const LOCATIONS_NAME = 'locations';

export const LocationVersionView = ({ version }) => {
  const versionContext = useContext(VersionViewContext);

  const locations = version?.locations;
  const locationsList = version?.locationsList;

  const renderKeyValueComponent = useCallback(({ name, value, ...props }) => {
    const isUpdated = versionContext?.paths?.includes(name);
    const displayValue = isUpdated ? <mark>{value || <NoValue />}</mark> : value;

    return (
      <KeyValue
        {...props}
        value={displayValue}
      />
    );
  }, [versionContext?.paths]);

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
