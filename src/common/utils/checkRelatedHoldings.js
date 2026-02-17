import { HoldingsAbandonmentPOLineStrategy } from '@folio/stripes-acq-components';

/*
  Checks if holdings contain other pieces and items
  that are not related to the given purchase order line.
*/
export const checkRelatedHoldings = (analyzer, actionType) => (poLines, holdingIds) => {
  const results = analyzer.analyze({
    actionType,
    explain: true,
    holdingIds,
    ids: poLines.map(({ id }) => id),
    strategy: HoldingsAbandonmentPOLineStrategy.name,
  });

  const holdingsItemsCount = results.reduce((acc, el) => acc + (el?.explain?.related?.items?.length || 0), 0);
  const willAbandoned = holdingIds.length && results.some((el) => el?.abandoned);
  const relatedToAnother = holdingIds.length && results.some((el) => !el?.abandoned);

  return {
    holdingIds,
    holdingsItemsCount,
    relatedToAnother,
    willAbandoned,
  };
};
