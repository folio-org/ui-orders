import PropTypes from 'prop-types';

import LocationView from '../../Location/LocationView';

export const LocationVersionView = ({ version }) => {
  const locations = version?.locations;
  const locationsList = version?.locationsList;

  return (
    <LocationView
      lineLocations={locations}
      locations={locationsList}
    />
  );
};

LocationVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
