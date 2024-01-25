import intersection from 'lodash/intersection';
import partition from 'lodash/partition';

/**
  Return a list of funds that are not restricted by locations or restricted by specified locations.

  @param {string[]} locationIds - A list of location IDs and holding's permanent location IDs assigned to a PO Line.
  @param {object[]} funds - A list of funds to filter.
*/
export const filterFundsRestrictedByLocations = (locationIds, funds) => {
  if (!locationIds?.length) return funds;

  const filteredFunds = funds.filter(({ restrictByLocations, locationIds: fundLocationIds }) => {
    return !restrictByLocations || (intersection(locationIds, fundLocationIds).length > 0);
  });

  return filteredFunds;
};

/**
  Returns a list of locations that restrict funds. If at least one fund is not location-restricted, returns all available locations.
  Besides, it allows to take into account the initial value.

  @param {object[]} funds - A list of funds assigned to a PO Line.
  @param {object[]} locations - A list of locations to filter.
  @param {string[]} includeLocationIds - A list of location IDs that should be persisted (Basically, used to keep initial value of the field).
*/
export const filterLocationsByRestrictedFunds = (funds, locations, includeLocationIds = []) => {
  const [restrictedFunds, unrestrictedFunds] = partition(funds, ({ restrictByLocations }) => restrictByLocations);

  if (!funds?.length || unrestrictedFunds.length) return locations;

  const validLocationSet = new Set(
    restrictedFunds
      .flatMap(({ locationIds }) => locationIds)
      .concat(includeLocationIds),
  );
  const validLocations = locations.filter(({ id }) => validLocationSet.has(id));

  return validLocations;
};

/**
  Returns a list of holdings for which their permanent locations restrict funds. If at least one fund is not location-restricted, returns all available holdings.
  Besides, it allows to take into account the initial value.

  @param {object[]} funds - A list of funds assigned to a PO Line.
  @param {object[]} holdings - A list of holdings to filter.
  @param {string[]} includeHoldingIds - A list of holding IDs that should be persisted (Basically, used to keep initial value of the field).
*/
export const filterHoldingsByRestrictedFunds = (funds, holdings, includeHoldingIds = []) => {
  const [restrictedFunds, unrestrictedFunds] = partition(funds, ({ restrictByLocations }) => restrictByLocations);

  if (!funds?.length || unrestrictedFunds.length) return holdings;

  const validLocationSet = new Set(restrictedFunds.flatMap(({ locationIds }) => locationIds));
  const persistedHoldingIdsSet = new Set(includeHoldingIds);

  const validHoldings = holdings.filter(({ id, permanentLocationId }) => {
    return validLocationSet.has(permanentLocationId) || persistedHoldingIdsSet.has(id);
  });

  return validHoldings;
};
