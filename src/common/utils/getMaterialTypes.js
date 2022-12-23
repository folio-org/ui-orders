import { MATERIAL_TYPE_API } from '@folio/stripes-acq-components';

export const getMaterialTypes = (ky) => async () => {
  const searchParams = {
    query: 'cql.allRecords=1 sortby name',
  };

  return ky.get(MATERIAL_TYPE_API, { searchParams }).json();
};
