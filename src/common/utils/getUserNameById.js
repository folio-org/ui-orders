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
        ? `${user.personal.firstName} ${user.personal.lastName}`
        : '';

      return newUserValue;
    })
    .catch(() => '');
};
