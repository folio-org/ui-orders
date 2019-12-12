import { range, chunk, flatten } from 'lodash';

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
