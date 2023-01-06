import PropTypes from 'prop-types';

import LocationView from '../../Location/LocationView';

const LOCATIONS_NAME = 'locations';

export const LocationVersionView = ({ version }) => {
  const locations = version?.locations;
  const locationsList = version?.locationsList;

  return (
    <LocationView
      lineLocations={locations}
      locations={locationsList}
      name={LOCATIONS_NAME}
    />
  );
};

LocationVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
