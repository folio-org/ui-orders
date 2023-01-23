import { get } from 'lodash';

export const getVersionMetadata = (version, entity) => ({
  ...get(entity, 'metadata', {}),
  updatedByUserId: version?.userId,
  updatedDate: version?.actionDate,
});
