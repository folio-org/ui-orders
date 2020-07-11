import { getFullName } from '@folio/stripes/util';

export const getUserNameById = (mutator, id) => {
  if (!id) {
    return Promise.resolve('');
  }

  return mutator.GET({
    params: {
      query: `id == ${id}`,
    },
  })
    .then(users => {
      const user = users[0];
      const newUserValue = user && user.personal
        ? getFullName(user)
        : '';

      return newUserValue;
    })
    .catch(() => '');
};
