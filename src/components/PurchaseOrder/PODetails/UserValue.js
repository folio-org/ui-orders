import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { getUserNameById } from '../../../common/utils';
import { USERS } from '../../Utils/resources';

const UserValue = ({ userId, mutator }) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);
  const [userValue, setUserValue] = useState('');

  useEffect(
    () => {
      getUserNameById(memoizedMutator.userValueResource, userId)
        .then(userName => setUserValue(userName));
    },
    [memoizedMutator.userValueResource, userId],
  );

  return <span data-test-created-by-name>{userValue}</span>;
};

UserValue.manifest = Object.freeze({
  userValueResource: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
});

UserValue.propTypes = {
  userId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(UserValue);
