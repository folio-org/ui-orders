import {
  LIMIT_MAX,
  LOCATIONS_API,
} from '@folio/stripes-acq-components';

export const getLocations = (ky) => async () => {
  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  return ky.get(LOCATIONS_API, { searchParams }).json();
};
