import {
  fetchAllRecords,
  ITEMS_API,
} from '@folio/stripes-acq-components';

export const getPOLineItems = (ky) => (poLine) => {
  return fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { items } = await ky.get(ITEMS_API, { searchParams }).json();

        return items;
      },
    },
    `purchaseOrderLineIdentifier==${poLine.id}`,
  );
};
