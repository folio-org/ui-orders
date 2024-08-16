export const getConsortiumPOLineLocationTenants = (poLine) => {
  return poLine.locations?.map(({ tenantId }) => tenantId)?.filter(Boolean) || [];
};
