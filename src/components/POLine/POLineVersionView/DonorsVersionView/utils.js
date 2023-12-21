export const getDonorUrl = (orgId) => {
  if (orgId) {
    return `/organizations/view/${orgId}`;
  }

  return undefined;
};
