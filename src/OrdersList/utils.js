import { uniq } from 'lodash';

import { batchFetch } from '@folio/stripes-acq-components';

export const fetchOrderVendors = (mutator, orders, fetchedVendorsMap) => {
  const unfetchedVendors = orders
    .filter(({ vendor }) => !fetchedVendorsMap[vendor])
    .map(({ vendor }) => vendor)
    .filter(Boolean);

  const fetchVendorsPromise = unfetchedVendors.length
    ? batchFetch(mutator, uniq(unfetchedVendors))
    : Promise.resolve([]);

  return fetchVendorsPromise;
};

export const fetchOrderAcqUnits = (mutator, orders, fetchedAcqUnitsMap) => {
  const unfetchedAcqUnits = orders
    .reduce((acc, { acqUnitIds = [] }) => [...acc, ...acqUnitIds], [])
    .filter((unitId) => !fetchedAcqUnitsMap[unitId])
    .filter(Boolean);

  const fetchAcqUnitsPromise = unfetchedAcqUnits.length
    ? batchFetch(mutator, uniq(unfetchedAcqUnits))
    : Promise.resolve([]);

  return fetchAcqUnitsPromise;
};

export const fetchOrderUsers = (mutator, orders, fetchedUsersMap) => {
  const unfetchedUsers = orders
    .filter(({ assignedTo }) => !fetchedUsersMap[assignedTo])
    .map(({ assignedTo }) => assignedTo)
    .filter(Boolean);

  const fetchUsersPromise = unfetchedUsers.length
    ? batchFetch(mutator, uniq(unfetchedUsers))
    : Promise.resolve([]);

  return fetchUsersPromise;
};
