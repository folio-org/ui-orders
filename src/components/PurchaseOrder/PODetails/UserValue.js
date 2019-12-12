import { useState, useEffect } from 'react';

import { stripesConnect } from '@folio/stripes/core';

import { getUserNameById } from '../../../common/utils';
import { USERS } from '../../Utils/resources';

const UserValue = ({ userId, mutator }) => {
  const [userValue, setUserValue] = useState('');

  useEffect(
    () => {
      getUserNameById(mutator.userValueResource, userId)
        .then(userName => setUserValue(userName));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId],
  );

  return userValue;
};

UserValue.manifest = Object.freeze({
  userValueResource: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(UserValue);
