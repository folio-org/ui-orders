import React from 'react';

import { SelectionFilter } from '@folio/stripes-acq-components';

import { getUserOptions } from '../utils';
import { usersShape } from '../shapes';

const UserFilter = ({ users, ...rest }) => {
  if (!users) return null;
  const options = getUserOptions(users);

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
};

UserFilter.propTypes = {
  users: usersShape,
};

export default UserFilter;
