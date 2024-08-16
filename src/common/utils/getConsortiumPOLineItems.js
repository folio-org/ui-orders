import queryString from 'query-string';

import {
  fetchAllRecords,
  ITEMS_API,
} from '@folio/stripes-acq-components';

import { getConsortiumPOLineLocationTenants } from './getConsortiumPOLineLocationTenants';

export const getConsortiumPOLineItems = (initPublicationRequest, { signal } = {}) => (poLine) => {
  const tenants = getConsortiumPOLineLocationTenants(poLine);

  return fetchAllRecords(
    {
      GET: async ({ params }) => {
        const { publicationResults } = await initPublicationRequest({
          url: `${ITEMS_API}?${queryString.stringify(params, { encode: false })}`,
          method: 'GET',
          tenants,
        }, { signal });

        return publicationResults.flatMap(({ response }) => response.items);
      },
    },
    `purchaseOrderLineIdentifier==${poLine.id}`,
  );
};
