import uniq from 'lodash/uniq';

import {
  batchFetch,
  ResponseErrorsContainer,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../common/constants';
import {
  genericErrorStrategy,
  isRequestTooLargeError,
  tooLargeRequestStrategy,
} from '../common/utils/errorHandling';

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

export const handleOrdersListLoadingError = async ({ response }, callout, intl) => {
  const { handler } = await ResponseErrorsContainer.create(response);

  if (isRequestTooLargeError(response)) {
    return handler.handle(tooLargeRequestStrategy({ callout }));
  }

  return handler.handle(genericErrorStrategy({
    callout,
    defaultErrorCode: ERROR_CODES.ordersNotLoadedGeneric,
    intl,
  }));
};
