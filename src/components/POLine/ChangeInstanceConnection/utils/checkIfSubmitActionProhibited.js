export const checkIfSubmitActionProhibited = (stripes, poLine) => {
  const userTenantIdsSet = new Set(stripes?.user?.user?.tenants?.map(({ id }) => id));
  const holdingTenantIdsSet = new Set(poLine?.locations?.reduce((acc, { holdingId, tenantId }) => {
    return Boolean(holdingId && tenantId) ? acc.add(tenantId) : acc;
  }, new Set()));
  
  return holdingTenantIdsSet.difference(userTenantIdsSet).size > 0;
}
