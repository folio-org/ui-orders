import { range, chunk, flatten, uniq } from 'lodash';

import { batchFetch } from '@folio/stripes-acq-components';

const LIMIT = 1000;
const CHUNKS_SIZE = 5;

const batchLoadUsers = (mutator, userOffsetChunks) => {
  const usersPromise = Promise.resolve([]);

  return userOffsetChunks.reduce((usersPromiseAcc, userOffsetChunk) => {
    const newUsersPromise = usersPromiseAcc
      .then((response) => {
        const userOffsetChunkPromise = Promise.all(
          userOffsetChunk.map(userOffset => {
            return mutator.GET({
              params: {
                limit: LIMIT,
                offset: userOffset,
                query: 'cql.allRecords=1 sortby personal.firstName personal.lastName',
              },
            });
          }),
        );

        return Promise.all([...response, userOffsetChunkPromise]);
      });

    return newUsersPromise;
  }, usersPromise);
};

// eslint-disable-next-line import/prefer-default-export
export const getUsersInBatch = (mutator) => {
  return mutator.GET({
    params: {
      limit: 0,
    },
    records: undefined,
  })
    .then(({ totalRecords }) => {
      const userOffsets = range(0, totalRecords, LIMIT);

      return chunk(userOffsets, CHUNKS_SIZE);
    })
    .then(userOffsetChunks => {
      return batchLoadUsers(mutator, userOffsetChunks);
    })
    .then(
      userChunks => flatten(userChunks).reduce((usersAcc, usersChunk) => [...usersAcc, ...usersChunk], []),
    );
};

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
