import { batchFetch } from '@folio/stripes-acq-components';

const buildQueryByIds = (itemsChunk) => {
  const query = itemsChunk
    .map(id => `id==${id}`)
    .join(' || ');  // ERM api works with that format

  return query || '';
};

export default function fetchAgreementLines(mutatorAgreementLines, mutatorAgreements, lineId, nextPage) {
  return mutatorAgreementLines.GET({
    params: {
      filters: `poLines.poLineId==${lineId}`,
      stats: true,
      page: nextPage,
    },
  })
    .then(agreementLinesResp => {
      const agreementIds = agreementLinesResp.results
        .filter(({ owner }) => owner?.id && !owner.agreementStatus)
        .map(({ owner: { id } }) => id);

      return Promise.all([batchFetch(mutatorAgreements, agreementIds, buildQueryByIds, undefined, 'filters'), agreementLinesResp]);
    })
    .then(([agreementsResponse, agreementLinesResp]) => ({
      ...agreementLinesResp,
      results: agreementLinesResp.results.map(line => ({
        ...line,
        owner: agreementsResponse.find(({ id }) => id === line.owner?.id) || line.owner,
      })),
    }));
}
