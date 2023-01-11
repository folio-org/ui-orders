import { LOCATIONS_API } from '@folio/stripes-acq-components';

export const getLocations = (ky) => async () => {
  const searchParams = {
    query: 'cql.allRecords=1 sortby name',
  };

  return ky.get(LOCATIONS_API, { searchParams }).json();
};
