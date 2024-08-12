import {
  fetchAllRecords,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const getPOLinePieces = (ky) => (poLine) => {
  return fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { pieces } = await ky.get(ORDER_PIECES_API, { searchParams }).json();

        return pieces;
      },
    },
    `poLineId==${poLine.id}`,
  );
};
