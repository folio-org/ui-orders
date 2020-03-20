import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { reasonsForClosureResource } from '../common/resources';
import {
  ACQUISITIONS_UNITS,
  USERS,
} from '../components/Utils/resources';
import OrdersListFilters from './OrdersListFilters';
import { getUsersInBatch } from './utils';

const OrdersListFiltersContainer = ({ resources, activeFilters, applyFilters, mutator }) => {
  const [users, setUsers] = useState();

  useEffect(
    () => {
      getUsersInBatch(mutator.users)
        .then(setUsers(users));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const acqUnits = resources?.acqUnits?.records;
  const closingReasons = resources?.closingReasons?.records;

  return (
    <OrdersListFilters
      acqUnits={acqUnits}
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      closingReasons={closingReasons}
      users={users}
    />
  );
};

OrdersListFiltersContainer.manifest = Object.freeze({
  acqUnits: ACQUISITIONS_UNITS,
  closingReasons: reasonsForClosureResource,
  users: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
});

OrdersListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrdersListFiltersContainer);
