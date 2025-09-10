export default (template = {}, relatedData = {}) => {
  if (template.locations && relatedData.locations) {
    const locationIdMap = relatedData.locations.reduce((acc, { id: locationId }) => {
      acc[locationId] = true;

      return acc;
    }, {});

    template.locations = template.locations.map(location => ({
      ...location,
      locationId: locationIdMap[location.locationId] ? location.locationId : undefined,
    }));
  }

  return template;
};
