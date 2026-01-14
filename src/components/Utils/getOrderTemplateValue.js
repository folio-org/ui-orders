export default (template = {}, relatedData = {}) => {
  const result = structuredClone(template);

  if (template.locations && relatedData.locations) {
    const locationIdMap = relatedData.locations.reduce((acc, { id: locationId }) => {
      acc[locationId] = true;

      return acc;
    }, {});

    result.locations = template.locations.map(location => ({
      ...location,
      locationId: locationIdMap[location.locationId] ? location.locationId : undefined,
    }));
  }

  return result;
};
