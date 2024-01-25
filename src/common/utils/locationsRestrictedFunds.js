import intersection from 'lodash/intersection';
import keyBy from 'lodash/keyBy';
import partition from 'lodash/partition';
import uniq from 'lodash/uniq';

// TODO: remove
import differenceBy from 'lodash/differenceBy';

/*
  Return a list of funds that are not restricted by locations or restricted by specified locations.
*/
export const filterFundsRestrictedByLocations = (locationIds, funds) => {
  // console.log('locationIds', locationIds);
  // console.log('funds', funds);

  if (!locationIds?.length) return funds;

  const filteredFunds = funds.filter(({ restrictByLocations, locationIds: fundLocationIds }) => {
    return !restrictByLocations || (intersection(locationIds, fundLocationIds).length > 0);
  });

  // console.log('filteredFunds', filteredFunds);
  // console.log('hidden', differenceBy(funds, filteredFunds, 'id'));

  return filteredFunds;
};

export const filterLocationsByRestrictedFunds = (funds, locations, includeLocationIds = []) => {
  const [restrictedFunds, unrestrictedFunds] = partition(funds, ({ restrictByLocations }) => restrictByLocations);

  if (!funds?.length || unrestrictedFunds.length) return locations;

  const locationsMap = keyBy(locations, 'id');
  const validLocations = uniq(
    restrictedFunds
      .flatMap(({ locationIds }) => locationIds)
      .concat(includeLocationIds),
  )
    .reduce((acc, locationId) => {
      const location = locationsMap[locationId];

      if (location) acc.push(location);

      return acc;
    }, []);

  return validLocations;
};

export const filterHoldingsByRestrictedFunds = (funds, holdings, includePermanentLocationIds = []) => {
  const [restrictedFunds, unrestrictedFunds] = partition(funds, ({ restrictByLocations }) => restrictByLocations);

  if (!funds?.length || unrestrictedFunds.length) return holdings;

  const validLocationSet = new Set(
    restrictedFunds
      .flatMap(({ locationIds }) => locationIds)
      .concat(includePermanentLocationIds),
  );

  const validHoldings = holdings.filter(({ permanentLocationId }) => validLocationSet.has(permanentLocationId));

  return validHoldings;
};
